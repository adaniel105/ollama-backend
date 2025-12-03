import * as fs from "fs"
import * as path from "path"


export const readImgData = async (image_path, imgDataArr) => {
    try {
        let image_dir = fs.readdirSync(image_path) //returns an array of paths btw
        image_dir = image_dir.map(f => path.join(image_path, f))
        console.log('Image read successfully!');
        for (let dir in image_dir){
           let data = fs.readFileSync(image_dir[dir], { encoding: "base64" }); 
           data = "data:image/png;base64," + data;
            imgDataArr.push(data);
        }
    } catch (error) {
        console.error('Error reading image:', error.message);
    }
}