import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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

let reviewNumber = document.getElementById('reviewId')
let movieName = document.getElementById('movie-name')
let rating = document.getElementById('movie-rating')
let review = document.getElementById('movie-review')
let directorName = document.getElementById('director-name')
let releaseDate = document.getElementById('release-date') 
let button = document.querySelector('#btn')
let editBtn = document.querySelector('#editBtn')
let deleteBtn = document.querySelector('#deleteBtn')

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
        alert('Data added already');
        reviewNumber.value = '',
        movieName.value = '';
        rating.value = '';
        review.value = '';
        directorName.value = '';
        releaseDate.value = '';
    })
    .catch(() => {
        alert('Data added unsuccessfully');
    })
}

displayCollection()

/* FUNCTION TO DISPLAY THE DATA ON THE WEB-APP */
async function displayCollection() {
    try {
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


async function updateFieldDocument() {
    // Get the document reference
    let ref = doc(db, "movieReviewData", reviewNumber.value);

    try {
        //GET DOCUMENT SNAPSHOT
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

async function deleteFieldDocument() {
    let ref = doc(db, "movieReviewData", reviewNumber.value)
    const docSnap = await getDoc(ref)

    if(!docSnap.exists()) {
        alert('Document does not exist')
        return;
    }

    await deleteDoc(ref)
    .then(() => {
        alert('Data deleted already');
        reviewNumber.value = '',
        movieName.value = '';
        rating.value = '';
        review.value = '';
        directorName.value = '';
        releaseDate.value = '';
    })
    .catch(() => {
        alert('Data not deleted unsuccessfully');
    })
    displayCollection()
} 


button.addEventListener('click', saveCustom)
editBtn.addEventListener('click', updateFieldDocument)
deleteBtn.addEventListener('click', deleteFieldDocument)