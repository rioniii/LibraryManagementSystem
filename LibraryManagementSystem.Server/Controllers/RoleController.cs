using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LibraryManagementSystem.Server.Services;
using Microsoft.AspNetCore.Identity;
using LibraryManagementSystem.Server.Models;

namespace LibraryManagementSystem.Server.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class RoleController : ControllerBase
    {
        private readonly RoleService _roleService;
        private readonly UserManager<ApplicationUser> _userManager;

        public RoleController(RoleService roleService, UserManager<ApplicationUser> userManager)
        {
            _roleService = roleService;
            _userManager = userManager;
        }

        [HttpPost("assign")]
        public async Task<IActionResult> AssignRole([FromBody] RoleAssignmentRequest request)
        {
            var result = await _roleService.AssignRoleToUser(request.UserId, request.RoleName);
            if (!result)
                return BadRequest("Failed to assign role");

            return Ok("Role assigned successfully");
        }

        [HttpPost("remove")]
        public async Task<IActionResult> RemoveRole([FromBody] RoleAssignmentRequest request)
        {
            var result = await _roleService.RemoveRoleFromUser(request.UserId, request.RoleName);
            if (!result)
                return BadRequest("Failed to remove role");

            return Ok("Role removed successfully");
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserRoles(string userId)
        {
            var roles = await _roleService.GetUserRoles(userId);
            return Ok(roles);
        }

        [HttpGet("check")]
        public async Task<IActionResult> CheckUserRole([FromQuery] string userId, [FromQuery] string roleName)
        {
            var result = await _roleService.IsUserInRole(userId, roleName);
            return Ok(result);
        }
    }

    public class RoleAssignmentRequest
    {
        public string UserId { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
    }
} 