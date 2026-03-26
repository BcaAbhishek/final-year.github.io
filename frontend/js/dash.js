async function uploadResume(){

const file = document.getElementById("resume").files[0]

const formData = new FormData()
formData.append("resume", file)

const res = await fetch("http://localhost:5000/api/resume/analyze",{

method:"POST",
body:formData

})

const data = await res.json()

document.getElementById("skills").innerText = data.analysis

}





async function uploadResume() {

const file = document.getElementById("resume").files[0];

const formData = new FormData();
formData.append("resume", file);

const res = await fetch("http://localhost:5000/api/resume/analyze", {
method: "POST",
body: formData
});

const data = await res.json();

document.getElementById("analysisResult").innerText = data.result;

}