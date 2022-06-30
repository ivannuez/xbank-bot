var path = require('path');
var fs = require('fs');

var upload_helper = {

    storeWithOriginalName: (file) => {
        var fullNewPath = path.join(file.destination, file.originalname)
        fs.renameSync(file.path, fullNewPath)

        return {
            fileName: file.originalname
        }
    }
}

module.exports = upload_helper;