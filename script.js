// view button scroll down
document.getElementById('viewBtn').addEventListener('click',function(){
    document.getElementById('adoptPage').scrollIntoView({behavior:'smooth'});
})

const loadCategories = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.log(error))
};

const loadCards = () => {
    document.getElementById('spinner').style.display = 'block';
    setTimeout(() => {
        fetch("https://openapi.programming-hero.com/api/peddy/pets")
        .then((res) => res.json())
        .then((data) => displayCards(data.pets))
        .catch((error) => console.log(error))
        .finally(() => {
            document.getElementById('spinner').style.display = 'none';
        });
    }, 2000);
};


// Remove active btn
const removeActiveClass = () => {
    const buttons = document.getElementsByClassName("categoryBtn");
    for(let btn of buttons){
        btn.classList.remove("activeStyle");
    }
}

const loadCategoryCards = (id) => {

    document.getElementById('spinner').style.display = 'block';
    const petsContainer = document.getElementById("cards")
    petsContainer.innerHTML = "";
    
    setTimeout(() => {
        fetch(`https://openapi.programming-hero.com/api/peddy/category/${id}`)
        .then((res) => res.json())
        .then((data) => {
            const activeBtn= document.getElementById(`btn-${id}`)
            removeActiveClass();
            activeBtn.classList.add("activeStyle");
            displayCards(data.data);
        })
        .catch((error) => console.log(error))
        .finally(() => {
            document.getElementById('spinner').style.display = 'none';
        });
    }, 2000);
};

// Adopt btn functionality
const adoptBtn = (button) => {
    let countdown = 3;
    const adoptContents = document.getElementById("adoptContainer");
    adoptContents.innerHTML = `
    <div class="flex justify-center items-center flex-col">
        <img src="https://img.icons8.com/?size=48&id=q6BlPrJZmxHV&format=png" alt="Icon"/>
        <h1 class="text-2xl font-bold">Congrats</h1>
        <p class="text-md font-normal mb-6">Adoption process has started for your pet</p>
        <span id="countdown" class="text-4xl font-bold text-red-500">${countdown}</span>
    </div>
    `;
    document.getElementById("adoptModal").showModal();

    const interClock = setInterval(() => {
        countdown--;
        document.getElementById("countdown").innerText = countdown;

        if(countdown === 0){
            clearInterval(interClock);
            document.getElementById("adoptModal").close();
            button.innerText = "Adopted";
            button.disabled = true;
            button.classList.add("opacity-30", "pointer-events-none");
        }
    }, 1000);
};



// load Pet Details
const loadDetails = async (petId) => {
    const uri = `https://openapi.programming-hero.com/api/peddy/pet/${petId}`;
    const res = await fetch(uri);
    const data = await res.json();
    displayDetails(data.petData)
}

// Sorting
const descendingSort = () => {
    document.getElementById('spinner').style.display = 'block';
    const petsContainer = document.getElementById("cards")
    petsContainer.innerHTML = "";
        setTimeout(() => {
            fetch('https://openapi.programming-hero.com/api/peddy/pets')
            .then((res) => res.json())
            .then((data) => {
                const sortedPets = data.pets.sort((a, b) => b.price - a.price);
                displayCards(sortedPets);
            })
            .catch((error) => console.log(error))
            .finally(() => {
                document.getElementById('spinner').style.display = 'none';
            })
        }, 2000);
};


// liked pets
const likeBtn = (image) =>{
    const imageContainer = document.getElementById('imgContainer');
    imageContainer.innerHTML += `
    <div class="w-full h-auto border p-3 rounded-lg ">
    <img class="rounded object-cover h-full" src='${image}' />
    </div>
    `;
}

// display pet details
const displayDetails = (petDetails) => {
    console.log(petDetails);
    const detailContainer = document.getElementById("modalContent")
    detailContainer.innerHTML = `
    <img src=${petDetails.image} class="w-full h-[250px] object-cover rounded-lg"/>
    <div class="mb-2">
            <h2 class="card-title text-2xl font-bold">${petDetails.pet_name}</h2>
            <div class="flex justify-start gap-7 items-center">
            <div class="flex gap-1 items-center text-xl text-zinc-500"><i class="fa-solid fa-paw"></i><p>Breed: ${petDetails.breed? petDetails.breed:'N/A'}</p></div>
            <div class="flex gap-1 items-center text-xl text-zinc-500"><i class="fa-regular fa-calendar-days"></i><p>Birth: ${petDetails.date_of_birth?petDetails.date_of_birth:'N/A'}</p></div>
            </div>
            <div class="flex justify-start gap-6 items-center">
            <div class="flex gap-1 items-center text-xl text-zinc-500"><i class="fa-solid fa-venus-mars"></i><p>Gender: ${petDetails.gender?petDetails.gender:'N/A'}</p></div>
            <div class="flex gap-1 items-center text-xl text-zinc-500"><i class="fa-solid fa-dollar-sign"></i><p>Price: ${petDetails.price?petDetails.price+'$':'N/A'}</p></div>
            </div>
            <div class="flex gap-1 items-center text-xl text-zinc-500"><i class="fa-solid fa-syringe"></i><p>Vaccinated status: ${petDetails.vaccinated_status?petDetails.vaccinated_status:'N/A'}</p></div>
    </div><hr>
    <div>
    <h1 class="text-xl font-bold">Detail Information</h1>
    <p>${petDetails.pet_details}</p>
    </div>
    `

    document.getElementById("detailsModal").showModal();
}


const displayCategories = (categories) => {
    const categoryContainer = document.getElementById("categories")
    categories.forEach((item) => {
        const buttonContainer = document.createElement("div");
        buttonContainer.classList= "w-full"
        buttonContainer.innerHTML = `<button id="btn-${item.category}" class=" px-6 py-3 w-9/12 mx-auto sm:w-full flex gap-2 items-center justify-center rounded-xl bg-white border categoryBtn" onclick="loadCategoryCards('${item.category}')"><img src="${item.category_icon}" class="w-14 h-14"><p class="text-2xl font-bold">${item.category}</p></button>`
        categoryContainer.append(buttonContainer);
    });
};

const displayCards = (pets) => {
    const petsContainer = document.getElementById("cards")
    petsContainer.innerHTML = "";

    if(pets.length == 0){
        petsContainer.classList.remove("grid");
        petsContainer.innerHTML = `
        <div class="min-h-[500px] w-full bg-gray-100 rounded-lg flex flex-col gap-6 justify-center items-center">
            <img src="./images/error.webp"/ >
            <h1 class="text-3xl font-bold">No Information Available</h1>
            <p>Sorry we don't have any birds available.</p>
        </div>
        `;
        return;
    }
    else{
        petsContainer.classList.add("grid");
    }
    pets.forEach( (pet) => {
        const card = document.createElement("div");
        card.classList = "card card-compact p-3 sm:p-6 border ";
        card.innerHTML=`
        <figure class="h-[180px]">
        <img
        src=${pet.image}
        alt="Shoes" class="object-cover h-full w-full rounded-xl" />
        </figure>
        <div class="">
            <h2 class="card-title text-xl font-bold">${pet.pet_name}</h2>
            <div class="flex gap-1 items-center text-xl text-zinc-500"><i class="fa-solid fa-paw"></i><p>Breed: ${pet.breed? pet.breed : 'N/A'}</p></div>
            <div class="flex gap-1 items-center text-xl text-zinc-500"><i class="fa-regular fa-calendar-days"></i><p>Birth: ${pet.date_of_birth? pet.date_of_birth:'N/A'}</p></div>
            <div class="flex gap-1 items-center text-xl text-zinc-500"><i class="fa-solid fa-venus-mars"></i><p>Gender: ${pet.gender? pet.gender:'N/A'}</p></div>
            <div class="flex gap-1 items-center text-xl text-zinc-500"><i class="fa-solid fa-dollar-sign"></i><p>Price: ${pet.price? pet.price+'$':'N/A'}</p></div>
        </div>
        <hr>
        <div class="mt-4 grid grid-cols-2 xl:grid-cols-3 justify-between gap-3">
        <button onclick="likeBtn('${pet.image}')" class="hover:text-white hover:bg-[#0e7a81] border border-[#e6f1f2] px-4 py-1 rounded-lg text-xl text-[#0e7a81]"><i class="fa-solid fa-thumbs-up"></i></button>
        <button onclick="adoptBtn(this)" id="adopt-btn" class="hover:text-white hover:bg-[#0e7a81] border border-[#e6f1f2] px-4 py-1 rounded-lg text-xl text-[#0e7a81] font-bold">Adopt</button>
        <button id="detail-btn" onclick="loadDetails('${pet.petId}')" class="hover:text-white hover:bg-[#0e7a81] border border-[#e6f1f2] px-4 py-1 rounded-lg text-xl text-[#0e7a81] font-bold col-span-2 xl:col-span-1">Details</button>
        </div>
        `
        petsContainer.append(card)
    })
}





loadCategories();
loadCards();