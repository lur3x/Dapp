using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ErrorHandlingController : BaseApiController
{
  private readonly DataContext _context;

  public ErrorHandlingController(DataContext context)
  {
    _context = context;
  }

  [Authorize]
  [HttpGet("Auth")]
  public ActionResult<string> GetSecret()
  {
    return "secret";
  }

  [HttpGet("NotFound")]
  public ActionResult<AppUser> GetNotFound()
  {
    var thing = _context.Users.Find(-1);

    if (thing == null) return NotFound();

    return thing;
  }

  [HttpGet("ServerError")]
  public ActionResult<string> GetServerError()
  {
    var thing = _context.Users.Find(-1);

    var thingToReturn = thing.ToString();

    return thingToReturn;

  }

  [HttpGet("BadRequest")]
  public ActionResult<string> GetBadRequest()
  {
    return BadRequest();
  }

}
