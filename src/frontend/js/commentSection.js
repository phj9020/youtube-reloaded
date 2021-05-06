
const video = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelector(".deleteBtn");


// make it realtime
const addComment = (text, newCommentId) => {
    const videoComment = document.querySelector(".videoComment ul");
    const newComment = document.createElement("li");
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const p = document.createElement("p");
    p.innerText = text;
    const span = document.createElement("span");
    span.className = "deleteBtn";
    span.innerText = "❌";
    newComment.className = "comment";
    newComment.dataset.id = newCommentId;
    newComment.appendChild(icon);
    newComment.appendChild(p);
    newComment.appendChild(span);
    videoComment.prepend(newComment);
    window.location.reload();
}

const handleSubmit = async(event)=> {
    event.preventDefault();

    const textarea = form.querySelector("textarea");

    const text = textarea.value;
    const {videoid} = video.dataset;

    if(text !== ""){
        // send data to backend 
        const response = await fetch(`/api/videos/${videoid}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({text: text}),
        });

        const status = response.status;

        
        if(status === 201) {
            // get newCommentId from backend
            const json = await response.json();
            const newCommentId = json.newCommentId;

            addComment(text, newCommentId);
        }
        textarea.value = "";
    }
};


const handleDelete = async(event) => {
    event.preventDefault();
    const targetId = event.currentTarget.parentElement.dataset.id
    const {videoid} = video.dataset;

    const response = await fetch(`/api/videos/${videoid}/comment/delete`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({commentId: targetId}),
    });

    const status = response.status;
    
    if(status === 204) {
        event.target.parentElement.remove();
        window.location.reload();
    }
    
}

if(form) {
    form.addEventListener("submit", handleSubmit);
}

if(deleteBtn){
    deleteBtn.addEventListener("click", handleDelete);
}

