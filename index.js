import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyClLatXbf2bWXeFrHCVB09B55sEl7hrmjI",
  authDomain: "thenewreview-e49fe.firebaseapp.com",
  projectId: "thenewreview-e49fe",
  storageBucket: "thenewreview-e49fe.appspot.com",
  messagingSenderId: "35081402021",
  appId: "1:35081402021:web:edf40792d3862631793f4c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

let postReview = document.querySelector('#postData')
let toggle = document.getElementsByClassName('toggle')

let reviewNumber = document.getElementById('reviewId')
let movieName = document.getElementById('movie-name')
let rating = document.getElementById('movie-rating')
let review = document.getElementById('movie-review')
let directorName = document.getElementById('director-name')
let releaseDate = document.getElementById('release-date') 
let button = document.querySelector('#btn')
let editBtn = document.querySelector('#editBtn')
let deleteBtn = document.querySelector('#deleteBtn')


rating.addEventListener("input", function() {
    // Get the entered value
    let value = parseInt(rating.value);

    // Check if the value is within the range 1-5
    if (isNaN(value) || value < 1 || value > 5) {
        
        rating.value = "";
        alert("Please enter a number between 1 and 5.");
    }
});

/* FUNCTION TO SAVE THE DATA IN THE FIRESTORE DB WITH A CUSTOM ID OF REVIEW-NUMBER */
async function saveCustom() {
    let ref = doc(db, "movieReviewData", reviewNumber.value);
    const docRef = await setDoc(
        ref, {
            reviewNumber: reviewNumber.value,
            movieName: movieName.value,
            rating: rating.value,
            review: review.value,
            directorName: directorName.value,
            releaseDate: releaseDate.value
        }
    )
    .then(() => {
        alert('Your review post has been added successfully');
        reviewNumber.value = '',
        movieName.value = '';
        rating.value = '';
        review.value = '';
        directorName.value = '';
        releaseDate.value = '';
    })
    .catch(() => {
        alert('Review addition not successfull');
    })
    displayCollection()
}

displayCollection()

/* FUNCTION TO DISPLAY THE DATA ON THE WEB-APP */
async function displayCollection() {
    try {
    postReview.innerHTML = '';
    const collectionRef = collection(db, "movieReviewData");
    const querySnapshot = await getDocs(collectionRef);
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const docId = doc.id;
        const div = document.createElement("div");
        div.classList.add('post-div')
        div.innerHTML = `
            <p>Review Number: ${data.reviewNumber}</p>
            <p>Movie Name: ${data.movieName}</p>
            <p>Rating: ${data.rating}</p>
            <p>Review: ${data.review}</p>
            <p>Director Name: ${data.directorName}</p>
            <p>Release Date: ${data.releaseDate}</p>
        `;
        postReview.appendChild(div);
    });
    } catch (error) {
        console.error("Error displaying collection: ", error);
    }
}

/* FUNCTION TO EDIT REVIEW POST */
async function updateFieldDocument() {
    if (!reviewNumber.value) {
        alert("Please provide a the review number of the post you want to edit, then click on the edit button again.");
        return;
    }

    let ref = doc(db, "movieReviewData", reviewNumber.value);
    try {
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
            const data = docSnap.data();
            movieName.value = data.movieName;
            rating.value = data.rating;
            review.value = data.review;
            directorName.value = data.directorName;
            releaseDate.value = data.releaseDate;
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error getting document:", error);
    }
    displayCollection()
}

/* FUNCTION TO DELETE REVIEW POST */
async function deleteFieldDocument() {
    if (!reviewNumber.value) {
        alert("Please provide a the review number of the post you want to delete, then click on the delete button again.");
        return;
    }
    let ref = doc(db, "movieReviewData", reviewNumber.value)
    const docSnap = await getDoc(ref)
    if(!docSnap.exists()) {
        alert('Document does not exist')
        return;
    }
    await deleteDoc(ref)
    .then(() => {
        alert('The review has been deleted');
        reviewNumber.value = '',
        movieName.value = '';
        rating.value = '';
        review.value = '';
        directorName.value = '';
        releaseDate.value = '';
    })
    .catch(() => {
        alert('Review deletion not successful');
    })
    displayCollection()
} 


button.addEventListener('click', saveCustom)
editBtn.addEventListener('click', updateFieldDocument)
deleteBtn.addEventListener('click', deleteFieldDocument)