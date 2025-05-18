using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LibraryManagementSystem.Server.Services;
using Microsoft.AspNetCore.Identity;
using LibraryManagementSystem.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LibraryManagementSystem.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoleController : ControllerBase
    {
        private readonly RoleService _roleService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public RoleController(RoleService roleService, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _roleService = roleService;
            _userManager = userManager;
            _roleManager = roleManager;
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

        // GET: api/Role
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IdentityRole>>> GetRoles()
        {
            return await _roleManager.Roles.ToListAsync();
        }

        // GET: api/Role/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IdentityRole>> GetRole(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);

            if (role == null)
            {
                return NotFound();
            }

            return role;
        }

        // POST: api/Role
        [HttpPost]
        public async Task<ActionResult<IdentityRole>> PostRole(IdentityRole role)
        {
            var result = await _roleManager.CreateAsync(role);

            if (result.Succeeded)
            {
                return CreatedAtAction(nameof(GetRole), new { id = role.Id }, role);
            }

            return BadRequest(result.Errors);
        }

        // DELETE: api/Role/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
            {
                return NotFound();
            }

            var result = await _roleManager.DeleteAsync(role);

            if (result.Succeeded)
            {
                return NoContent();
            }

            return BadRequest(result.Errors);
        }
    }

    public class RoleAssignmentRequest
    {
        public string UserId { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
    }
} 