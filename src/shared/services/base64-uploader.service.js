
export class Base64Manager {
    constructor() {}
    
    async upload(event, datahandler){
        const file = event.target.files[0];
        const reader = new FileReader();
        let blob = await fetch(file.objectURL).then(r => r.blob());
        reader.readAsDataURL(blob);
        reader.onloadend = function (){
            datahandler.data = reader.result;
            console.log(datahandler.data)
        }
    }
}