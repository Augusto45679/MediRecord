from datetime import UTC, date, datetime, timedelta

import pytest

from app.models import DoseLog, Medicine
from app.schedule import build_day_doses, dose_id, local_today, parse_dose_id

TZ = "America/Argentina/Buenos_Aires"
D = date(2026, 11, 26)  # jueves
NOW = datetime(2026, 11, 26, 15, 0, tzinfo=UTC)  # 12:00 local
ALL = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"]


def med(id, times, days=ALL, created=date(2026, 11, 1), status="active", deleted=None):
    return Medicine(
        id=id,
        patient_id=1,
        name=f"Med{id}",
        dose="500 mg · 1 comprimido",
        times=times,
        days=days,
        status=status,
        added_by="Ana",
        created_at=datetime(created.year, created.month, created.day, 12, 0, tzinfo=UTC),
        deleted_at=deleted,
    )


def log(med_id, day, time, status, registered_utc=None, reason=None):
    return DoseLog(
        medicine_id=med_id,
        patient_id=1,
        day=day,
        scheduled_time=time,
        status=status,
        registered_at=registered_utc,
        omission_reason=reason,
    )


def test_dose_id_roundtrip():
    assert dose_id(7, D, "08:00") == "7_2026-11-26_0800"
    assert parse_dose_id("7_2026-11-26_0800") == (7, D, "08:00")
    with pytest.raises(ValueError):
        parse_dose_id("basura")


def test_day_uses_patient_timezone():
    assert local_today(datetime(2026, 11, 27, 1, 30, tzinfo=UTC), TZ) == D


def test_pending_before_threshold_unconfirmed_after():
    m = med(1, ["14:00"])
    at_1459 = datetime(2026, 11, 26, 17, 59, tzinfo=UTC)
    at_1501 = datetime(2026, 11, 26, 18, 1, tzinfo=UTC)
    assert build_day_doses([m], [], D, at_1459, TZ, 60)[0].status == "pending"
    assert build_day_doses([m], [], D, at_1501, TZ, 60)[0].status == "unconfirmed"


def test_past_day_without_log_is_unconfirmed():
    doses = build_day_doses([med(1, ["08:00"])], [], D - timedelta(days=1), NOW, TZ, 60)
    assert doses[0].status == "unconfirmed"


def test_taken_log_sets_local_taken_at_and_delay():
    l = log(1, D, "14:00", "taken", registered_utc=datetime(2026, 11, 26, 18, 20, tzinfo=UTC))
    d = build_day_doses([med(1, ["14:00"])], [l], D, NOW, TZ, 60)[0]
    assert (d.status, d.taken_at, d.is_delayed) == ("taken", "15:20", True)


def test_days_filter_excludes_other_weekdays():
    assert build_day_doses([med(1, ["08:00"], days=["lun"])], [], D, NOW, TZ, 60) == []


def test_paused_medicine_has_no_new_doses():
    assert build_day_doses([med(1, ["08:00"], status="paused")], [], D, NOW, TZ, 60) == []


def test_medicine_created_after_day_not_in_past():
    assert build_day_doses([med(1, ["08:00"], created=D)], [], D - timedelta(days=1), NOW, TZ, 60) == []


def test_logged_dose_survives_schedule_change():
    l = log(1, D, "08:00", "taken", registered_utc=datetime(2026, 11, 26, 11, 5, tzinfo=UTC))
    at_0830 = datetime(2026, 11, 26, 11, 30, tzinfo=UTC)
    doses = build_day_doses([med(1, ["09:00"])], [l], D, at_0830, TZ, 60)
    assert [(d.time, d.status) for d in doses] == [("08:00", "taken"), ("09:00", "pending")]


def test_deleted_medicine_keeps_past_logs():
    m = med(1, ["08:00"], deleted=datetime(2026, 11, 26, 12, 0, tzinfo=UTC))
    l = log(1, D - timedelta(days=1), "08:00", "taken", registered_utc=datetime(2026, 11, 25, 11, 0, tzinfo=UTC))
    assert [d.status for d in build_day_doses([m], [l], D - timedelta(days=1), NOW, TZ, 60)] == ["taken"]
    assert build_day_doses([m], [], D + timedelta(days=1), NOW, TZ, 60) == []


def test_postponed_pending_log_keeps_pending_and_value():
    l = log(1, D, "14:00", "pending")
    l.postponed_until = "14:10"
    d = build_day_doses([med(1, ["14:00"])], [l], D, datetime(2026, 11, 26, 17, 5, tzinfo=UTC), TZ, 60)[0]
    assert (d.status, d.postponed_until) == ("pending", "14:10")
