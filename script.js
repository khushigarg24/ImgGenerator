const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");
const OPENAI_API_KEY = "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";
let isGeneratingImage = false;


const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".downlaod-btn");

        //set the image source to the ai generated image data
        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        //when the image is loaded remove the loading class and set downlaod attributes
        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime}.jpg`);
        }
    });
}

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        //send a request to the openai api to generate images based on user inputs
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`

            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });
        //throw an error if the api response is unsuccessful
        if (!response.ok) throw new Error("failed to generate please try again");

        const { data } = await response.json(); //get data from the response
        updateImageCard([...data]);
    }
    catch (error) {
        alert(error.message);
    }
    finally{
        isGeneratingImage = false;
    }
}

const handleFormSubmission = (e) => {
    e.preventDefault();

    if (isGeneratingImage) return;
    isGeneratingImage = true;

    //get user input and image quantity from this code
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;
    // console.log(userPrompt, userImgQuantity);


    //Creating html markups for image cards with loading state
    const imgCardMarkup = Array.from({ length: userImgQuantity }, () =>
        ` <div class="img-card loading">
        <img src="images/loader.svg" alt="image">
        <a href="" class="download-btn">
            <img src="images/download.svg" alt="download icon">
        </a>
    </div>`
    ).join("");


    imageGallery.innerHTML = imgCardMarkup;

    generateAiImages(userPrompt, userImgQuantity);
}

generateForm.addEventListener('submit', handleFormSubmission);