const fileNameGenerator = () =>{
    const timeStamp = Date.now();
    const random = Math.floor(Math.random() * 1000);

    return `file_${timeStamp}_${random}`
}

export default fileNameGenerator;