from datetime import UTC, datetime


def get_now() -> datetime:
    """Hora actual (UTC, aware). Se sobreescribe en tests."""
    return datetime.now(UTC)
