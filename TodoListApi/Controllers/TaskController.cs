using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoListApi.Data;
using TodoListApi.Models;
using System.Security.Claims;

namespace TodoListApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetTasks([FromQuery] string category = null)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new Exception("User ID not found in Claims"));
                var tasks = _context.Tasks.Where(t => t.UserId == userId);

                if (!string.IsNullOrEmpty(category))
                    tasks = tasks.Where(t => t.Category == category);

                return Ok(await tasks.ToListAsync());
            }
            catch (Exception ex)
            {
                return BadRequest($"Error retrieving tasks: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] TodoListApi.Models.Task task)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new Exception("User ID not found in Claims"));
                task.UserId = userId;
                task.CreatedAt = DateTime.UtcNow;
                _context.Tasks.Add(task);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error creating task: {ex.Message}");
            }
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetTask(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new Exception("User ID not found in Claims"));
                var task = await _context.Tasks.FindAsync(id);
                if (task == null || task.UserId != userId)
                    return NotFound();

                return Ok(task);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error retrieving task: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TodoListApi.Models.Task updatedTask)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new Exception("User ID not found in Claims"));
                var task = await _context.Tasks.FindAsync(id);
                if (task == null || task.UserId != userId)
                    return NotFound();

                task.Title = updatedTask.Title;
                task.Description = updatedTask.Description;
                task.IsCompleted = updatedTask.IsCompleted;
                task.Category = updatedTask.Category;
                task.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error updating task: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new Exception("User ID not found in Claims"));
                var task = await _context.Tasks.FindAsync(id);
                if (task == null || task.UserId != userId)
                    return NotFound();

                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error deleting task: {ex.Message}");
            }
        }
    }
}