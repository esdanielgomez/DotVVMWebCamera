export default (contextApp) => new App(contextApp);
var WEB;

class App {

    constructor(contextApp) {

        this.contextApp = contextApp;
        WEB = contextApp;

        Webcam.set({
            //width: 500,
            height: 360,
            image_format: 'jpeg',
            jpeg_quality: 100
        });

        Webcam.attach('#my_camera');
    }

    take_snapshot() {
        // take snapshot and get image data
        Webcam.snap(function (data_uri) {

            // display results in page
            document.getElementById('results').innerHTML = '<img src="' + data_uri + '" width="100%"/>';
            Webcam.upload(data_uri, '/', function (code, text) { alert('Photo Captured'); });

            var ImageURL = data_uri; // 'photo' is your base64 image
            // Split the base64 string in data and contentType
            var block = ImageURL.split(";");
            // Get the content type of the image
            var contentType = block[0].split(":")[1];// In this case "image/gif"
            // get the real base64 content of the file
            var realData = block[1].split(",")[1];

            // Convert it to a blob to upload
            var blob = b64toBlob(realData, contentType);;

            // Create a FormData and append the file with "image" as parameter name
            var formdata = new FormData();

            var today = new Date();
            var time = today.getHours().toString() + "" + today.getMinutes().toString() + "" + today.getSeconds().toString();
            var name = "image" + time + ".jpg";
            WEB.namedCommands["ImageFileResult"](name);

            formdata.append("file", blob, name);

            // Call to web API to save the image file
            let xhr = new XMLHttpRequest();
            xhr.open("POST", "api/SaveImage/Save/", true);
            xhr.send(formdata);

        });

        function b64toBlob(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = window.atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }
            var blob = new Blob(byteArrays, { type: contentType });
            return blob;
        }
    }
}

