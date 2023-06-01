using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;

namespace DotVVM_WebCamera.Api;

public class SaveImage : Controller
{
    private IWebHostEnvironment _hostingEnvironment;

    public SaveImage(IWebHostEnvironment hostingEnvironment)
    {
        _hostingEnvironment = hostingEnvironment;
    }

    [Route("api/[controller]/Save")]
    [HttpPost]
    public async Task<IActionResult> Save(IFormFile file)
    {
        //uploads where you want to save data inside wwwroot
        var uploads = Path.Combine(_hostingEnvironment.WebRootPath, "CameraPhotos");
        var filePath = Path.Combine(uploads, file.FileName);

        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        return Ok("File uploaded successfully!");
    }
}