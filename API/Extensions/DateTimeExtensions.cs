namespace API.Extensions;

public static class DateTimeExtensions
{
  public static int CalculateAge(this DateOnly bd)
  {
    var today = DateOnly.FromDateTime(DateTime.UtcNow);
    var age = today.Year - bd.Year;

    if (bd > today.AddYears(-age)) age--;

    return age;
  }
}
