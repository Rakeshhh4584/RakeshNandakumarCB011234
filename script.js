const currentURL = window.location.href;
let selectedflag = false;
let formattedDate = "No date selected";
const fileName = currentURL
  .substring(currentURL.lastIndexOf("/") + 1)
  .replace(".html", "");
let selectedOptions;
const slAdultInput = document.getElementById("slAdult");
const slChildInput = document.getElementById("slChild");
const foreignerAdultInput = document.getElementById("foreignerAdult");
const foreignerChildInput = document.getElementById("foreignerChild");
const infantInput = document.getElementById("infant");

const incrementBtns = document.querySelectorAll(".incrementBtn");
const decrementBtns = document.querySelectorAll(".decrementBtn");

const timelineTimeMap = {
  1: { startTime: "07.00 am", endTime: "08.00 am" },
  2: { startTime: "08.00 am", endTime: "09.00 am" },
  3: { startTime: "09.00 am", endTime: "10.00 am" },
  4: { startTime: "10.00 am", endTime: "11.00 am" },
  5: { startTime: "11.00 am", endTime: "12.00 pm" },
  6: { startTime: "12.00 pm", endTime: "01.00 pm" },
  7: { startTime: "01.00 pm", endTime: "02.00 pm" },
  8: { startTime: "02.00 pm", endTime: "03.00 pm" },
  9: { startTime: "03.00 pm", endTime: "04.00 pm" },
  10: { startTime: "04.00 pm", endTime: "05.00 pm" },
  11: { startTime: "05.00 pm", endTime: "06.00 pm" },
};

if (!(fileName == "detailspage" || fileName == "paymentspage")) {
  if (fileName == "ticketspage") {
    incrementBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const inputField = btn.previousElementSibling;
        inputField.value = parseInt(inputField.value) + 1;
        savelocal();
        createsummary();
      });
    });

    decrementBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const inputField = btn.nextElementSibling;
        if (parseInt(inputField.value) > 0) {
          inputField.value = parseInt(inputField.value) - 1;
          savelocal();
          createsummary();
        }
      });
    });

    function savelocal() {
      selectedOptions = {
        "Foreigner Adults": foreignerAdultInput.value,
        "Foreigner Child": foreignerChildInput.value,
        "SL Adults": slAdultInput.value,
        "SL Child": slChildInput.value,
        Infant: infantInput.value,
      };

      localStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
    }

    //experiment

    let selectedTimelines = [];
    let peakhours = [];
    let filteredSelectedTimelines = [];
    const dropdownc = document.querySelector(".dropdown-content");

    function togglee() {
      dropdownc.classList.toggle("open");
    }

    // Function to check if an array of numbers is consecutive
    function isConsecutiveSelection(arr) {
      if (arr.length < 2) return true;
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== arr[i - 1] + 1) {
          return false;
        }
      }
      return true;
    }

    function handleCheckboxChange(checkbox) {
      const value = checkbox.value;
      if (checkbox.checked) {
        // Add the value to the array if the checkbox is checked
        selectedTimelines.push(parseInt(value));
      } else {
        // Remove the value from the array if the checkbox is unchecked
        const index = selectedTimelines.indexOf(parseInt(value));
        if (index !== -1) {
          selectedTimelines.splice(index, 1);
        }
      }

      // Check if the selected timelines are consecutive after adding the new value
      if (!isConsecutiveSelection(selectedTimelines)) {
        // If not consecutive, uncheck the last selected checkbox and remove it from the array
        selectedTimelines.pop();
        checkbox.checked = false;
        return;
      }

      // Numbers to remove
      const numbersToRemove = [4, 5, 6, 9, 10, 11];
      peakhours = selectedTimelines.filter((number) =>
        numbersToRemove.includes(number)
      );
      filteredSelectedTimelines = selectedTimelines.filter(
        (number) => !numbersToRemove.includes(number)
      );

      // You can do something with the selectedTimelines array here
      console.log("peakhours: " + peakhours);
      console.log("filteredSelectedTimelines: " + filteredSelectedTimelines);
      console.log(selectedTimelines);
      createsummary();
    }

    function createsummary() {
      // Implementation of the summary creation goes here
      // You can use the 'peakhours' and 'filteredSelectedTimelines' arrays to generate the summary
      // For example:
      console.log("Summary:");
      console.log("Peak Hours: " + peakhours);
      console.log("Selected Timelines: " + filteredSelectedTimelines);
    }

    function findtime(selectedTimelines) {
      if (selectedTimelines.length === 1) {
        // If only one timeline is selected, use its start and end time
        const timelineValue = selectedTimelines[0];
        return {
          startTime: timelineTimeMap[timelineValue].startTime,
          endTime: timelineTimeMap[timelineValue].endTime,
        };
      } else {
        // If multiple timelines are selected, find the minimum and maximum timeline values
        const minTimelineValue = Math.min(...selectedTimelines);
        const maxTimelineValue = Math.max(...selectedTimelines);
        return {
          startTime: timelineTimeMap[minTimelineValue].startTime,
          endTime: timelineTimeMap[maxTimelineValue].endTime,
        };
      }
    }

    function createsummary() {
      // Get the date and time for the summary
      const date = formattedDate;
      const startTime = findtime(selectedTimelines).startTime;
      const endTime = findtime(selectedTimelines).endTime;
      const durationNormalHrs = filteredSelectedTimelines.length; //done
      const durationPeakHrs = peakhours.length; //done

      // Get the number of visitors in each category
      const foreignerAdults = parseInt(foreignerAdultInput.value);
      const foreignerChildren = parseInt(foreignerChildInput.value);
      const slAdults = parseInt(slAdultInput.value);
      const slChildren = parseInt(slChildInput.value);
      const infants = parseInt(infantInput.value);

      // Calculate the charges for each category
      const charges = {
        foreignerAdultNormal: 10,
        foreignerAdultPeak: 13,
        foreignerChildNormal: 5,
        foreignerChildPeak: 8,
        slAdultNormal: 4,
        slAdultPeak: 6,
        slChildNormal: 2,
        slChildPeak: 3,
      };

      // Calculate the charges for each category based on the number of normal and peak hours
      const foreignerAdultCharge =
        charges.foreignerAdultNormal * durationNormalHrs +
        charges.foreignerAdultPeak * durationPeakHrs;
      const foreignerChildCharge =
        charges.foreignerChildNormal * durationNormalHrs +
        charges.foreignerChildPeak * durationPeakHrs;
      const slAdultCharge =
        charges.slAdultNormal * durationNormalHrs +
        charges.slAdultPeak * durationPeakHrs;
      const slChildCharge =
        charges.slChildNormal * durationNormalHrs +
        charges.slChildPeak * durationPeakHrs;

      // Calculate the total charges for each category
      const totalForeignerAdultCharge = foreignerAdultCharge * foreignerAdults;
      const totalForeignerChildCharge =
        foreignerChildCharge * foreignerChildren;
      const totalSLAdultCharge = slAdultCharge * slAdults;
      const totalSLChildCharge = slChildCharge * slChildren;
      const continueBtn = document.getElementById("continueBtn");
      // Calculate the total payable amount
      const totalPayable =
        totalForeignerAdultCharge +
        totalForeignerChildCharge +
        totalSLAdultCharge +
        totalSLChildCharge;
      localStorage.setItem("totalPayable", JSON.stringify(totalPayable));
      // Generate the summary text
      const summary = `
    <table class="summaryttt">
        <tr><td>Date:</td><td> ${date}</td></tr>
        <tr><td>Time:</td><td> ${startTime} to ${endTime}</td></tr>
        <tr><td>Duration:</td><td> ${
          durationNormalHrs + durationPeakHrs
        } hrs (${durationNormalHrs} Normal : ${durationPeakHrs} Peak)</td></tr>
        <tr><th>Tickets</th><th>Charges</th></tr>
        <tr><td>${foreignerAdults} Foreigner Adult</td><td> $${totalForeignerAdultCharge}</td></tr>
        <tr><td>${foreignerChildren} Foreigner Child</td><td> $${totalForeignerChildCharge}</td></tr>
        <tr><td>${slAdults} SL Adult</td><td> $${totalSLAdultCharge}</td></tr>
        <tr><td>${slChildren} SL Child</td><td> $${totalSLChildCharge}</td></tr>
        <tr><td>${infants} Infant</td><td> Free</td></tr>
        <tr><th>Total Payable:</th><th>$${totalPayable}</th></tr>
    </table>
    `;

      localStorage.setItem("date", JSON.stringify(date));
      localStorage.setItem("startTime", JSON.stringify(startTime));
      localStorage.setItem("endTime", JSON.stringify(endTime));
      localStorage.setItem(
        "durationNormalHrs",
        JSON.stringify(durationNormalHrs)
      );
      localStorage.setItem("durationPeakHrs", JSON.stringify(durationPeakHrs));
      localStorage.setItem("foreignerAdults", JSON.stringify(foreignerAdults));
      localStorage.setItem(
        "foreignerChildren",
        JSON.stringify(foreignerChildren)
      );
      localStorage.setItem("slAdults", JSON.stringify(slAdults));
      localStorage.setItem("slChildren", JSON.stringify(slChildren));
      localStorage.setItem("infants", JSON.stringify(infants));
      localStorage.setItem(
        "totalForeignerAdultCharge",
        JSON.stringify(totalForeignerAdultCharge)
      );
      localStorage.setItem(
        "totalForeignerChildCharge",
        JSON.stringify(totalForeignerChildCharge)
      );
      localStorage.setItem(
        "totalSLAdultCharge",
        JSON.stringify(totalSLAdultCharge)
      );
      localStorage.setItem(
        "totalSLChildCharge",
        JSON.stringify(totalSLChildCharge)
      );
      localStorage.setItem("totalPayable", JSON.stringify(totalPayable));
      localStorage.setItem("summary", JSON.stringify(summary));
      document.getElementById("summarytbl").innerHTML = summary;

      if (totalPayable > 0 && selectedflag) {
        continueBtn.disabled = false;
      } else {
        continueBtn.disabled = true;
      }
      // You can display the summary on the webpage or do whatever you want with it here
    }

    function goto() {
      window.location.href = "detailspage.html";
    }
  } else {
    const date = JSON.parse(localStorage.getItem("date"));
    const startTime = JSON.parse(localStorage.getItem("startTime"));
    const endTime = JSON.parse(localStorage.getItem("endTime"));
    const durationNormalHrs = parseFloat(
      JSON.parse(localStorage.getItem("durationNormalHrs"))
    );
    const durationPeakHrs = parseFloat(
      JSON.parse(localStorage.getItem("durationPeakHrs"))
    );
    const foreignerAdults = parseInt(
      JSON.parse(localStorage.getItem("foreignerAdults"))
    );
    const foreignerChildren = parseInt(
      JSON.parse(localStorage.getItem("foreignerChildren"))
    );
    const slAdults = parseInt(JSON.parse(localStorage.getItem("slAdults")));
    const slChildren = parseInt(JSON.parse(localStorage.getItem("slChildren")));
    const infants = parseInt(JSON.parse(localStorage.getItem("infants")));
    const totalForeignerAdultCharge = parseFloat(
      JSON.parse(localStorage.getItem("totalForeignerAdultCharge"))
    );
    const totalForeignerChildCharge = parseFloat(
      JSON.parse(localStorage.getItem("totalForeignerChildCharge"))
    );
    const totalSLAdultCharge = parseFloat(
      JSON.parse(localStorage.getItem("totalSLAdultCharge"))
    );
    const totalSLChildCharge = parseFloat(
      JSON.parse(localStorage.getItem("totalSLChildCharge"))
    );
    const totalPayable = parseFloat(
      JSON.parse(localStorage.getItem("totalPayable"))
    );
    const fullName = JSON.parse(localStorage.getItem("fullName"));
    const mobileNumber = JSON.parse(localStorage.getItem("mobileNumber"));
    const email = JSON.parse(localStorage.getItem("email"));
    const gender = JSON.parse(localStorage.getItem("gender"));

    console.log(totalPayable);

    const confirmsummary = `
<table class="confirmtbl">
    <tr><td>Name:</td><td> ${fullName}</td></tr>
    <tr><td>Date:</td><td> ${date}</td></tr>
    <tr><td>Time:</td><td> ${startTime} to ${endTime}</td></tr>
    <tr><td>Duration:</td><td> ${
      durationNormalHrs + durationPeakHrs
    } hrs (${durationNormalHrs} Normal : ${durationPeakHrs} Peak)</td></tr>
    <tr><td>Mobile:</td><td> ${mobileNumber}</td></tr>
    <tr><td>email:</td><td> ${email}</td></tr>
    <tr><td>Gender:</td><td> ${gender}</td></tr>
    <tr><th>Tickets</th><th>Charges</th></tr>
    <tr><td>${foreignerAdults} Foreigner Adult</td><td> $${totalForeignerAdultCharge}</td></tr>
    <tr><td>${foreignerChildren} Foreigner Child</td><td> $${totalForeignerChildCharge}</td></tr>
    <tr><td>${slAdults} SL Adult</td><td> $${totalSLAdultCharge}</td></tr>
    <tr><td>${slChildren} SL Child</td><td> $${totalSLChildCharge}</td></tr>
    <tr><td>${infants} Infant</td><td> Free</td></tr>
    <tr><th>Total Payable:</th><th>$${totalPayable}</th></tr>
</table>
`;

    document.getElementById("summarytblconfirm").innerHTML = confirmsummary;
  }
} else {
  // DETAILS PAGE

  if (fileName == "detailspage") {
    document.getElementById("summarytbldetails").innerHTML = JSON.parse(
      localStorage.getItem("summary")
    );

    const fullNameInput = document.getElementById("fullName");
    const mobileNumberInput = document.getElementById("mobileNumber");
    const emailInput = document.getElementById("email");
    const confirmEmailInput = document.getElementById("confirmEmail");
    const genderInput = document.getElementById("gender");
    const continueButton = document.getElementById("continueButton");
    const phoneInputField = document.getElementById("mobileNumber");
    const phoneInput = window.intlTelInput(phoneInputField, {
      utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });

    const showError = (inputElement, errorMessage) => {
      const errorElement = document.getElementById(inputElement.id + "-error");
      errorElement.textContent = errorMessage;
      inputElement.classList.add("invalid");
    };

    const clearError = (inputElement) => {
      const errorElement = document.getElementById(inputElement.id + "-error");
      errorElement.textContent = "";
      inputElement.classList.remove("invalid");
    };

    const validateForm = () => {
      const fullName = fullNameInput.value.trim();
      const mobileNumber = mobileNumberInput.value.trim();
      const email = emailInput.value.trim();
      const confirmEmail = confirmEmailInput.value.trim();
      const gender = genderInput.value;

      const isFullNameValid = fullName !== "";
      const isMobileNumberValid =
        mobileNumber !== "" && /^\d+$/.test(mobileNumber);
      const isEmailValid =
        email !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const isConfirmEmailValid = confirmEmail === email;
      const isGenderValid = gender !== "";

      if (!isFullNameValid) {
        showError(fullNameInput, "Enter your full name");
      } else {
        clearError(fullNameInput);
      }

      if (!isMobileNumberValid) {
        showError(mobileNumberInput, "Enter a valid mobile number");
      } else {
        clearError(mobileNumberInput);
      }

      if (!isEmailValid) {
        showError(emailInput, "Enter a valid email address");
      } else {
        clearError(emailInput);
      }

      if (!isConfirmEmailValid) {
        showError(confirmEmailInput, "Email addresses do not match");
      } else {
        clearError(confirmEmailInput);
      }

      if (!isGenderValid) {
        showError(genderInput, "Select your gender");
      } else {
        clearError(genderInput);
      }

      // Check if all fields are valid
      const isFormValid =
        isFullNameValid &&
        isMobileNumberValid &&
        isEmailValid &&
        isConfirmEmailValid &&
        isGenderValid;

      return isFormValid;
    };

    const toggleContinueButton = () => {
      continueButton.disabled = !validateForm();
    };

    // Event listeners
    fullNameInput.addEventListener("input", toggleContinueButton);
    mobileNumberInput.addEventListener("input", toggleContinueButton);
    emailInput.addEventListener("input", toggleContinueButton);
    confirmEmailInput.addEventListener("input", toggleContinueButton);
    genderInput.addEventListener("input", toggleContinueButton);

    continueButton.addEventListener("click", () => {
      if (validateForm()) {
        // Perform form submission or any other action here

        const fullName = document.getElementById("fullName");
        const mobileNumber = document.getElementById("mobileNumber");
        const Email = document.getElementById("email");
        const gender = document.getElementById("gender");
        localStorage.setItem("fullName", JSON.stringify(fullName.value));
        localStorage.setItem(
          "mobileNumber",
          JSON.stringify(mobileNumber.value)
        );
        localStorage.setItem("email", JSON.stringify(Email.value));
        localStorage.setItem("gender", JSON.stringify(gender.value));
      }
    });
  } else {
    // PAYMENTS PAGE

    document.getElementById("summarytbldetails").innerHTML = JSON.parse(
      localStorage.getItem("summary")
    );

    const cardNumberInput = document.getElementById("card-number");
    const expiryDateInput = document.getElementById("expiry-date");
    const cvcInput = document.getElementById("cvc");
    const nameOnCardInput = document.getElementById("name-on-card");
    const payBtn = document.getElementById("pay-btn");
    const amountSpan = document.getElementById("amount");

    amountSpan.textContent =
      "$" + JSON.parse(localStorage.getItem("totalPayable"));
    const showError = (inputElement, errorMessage) => {
      const errorElement = document.getElementById(inputElement.id + "-error");
      errorElement.textContent = errorMessage;
      inputElement.classList.add("invalid");
    };

    const clearError = (inputElement) => {
      const errorElement = document.getElementById(inputElement.id + "-error");
      errorElement.textContent = "";
      inputElement.classList.remove("invalid");
    };

    const validateForm = () => {
      const cardNumber = cardNumberInput.value.trim();
      const expiryDate = expiryDateInput.value.trim();
      const cvc = cvcInput.value.trim();
      const nameOnCard = nameOnCardInput.value.trim();

      // Simple form validation for demonstration purposes (You should implement more robust validation)
      const isCardNumberValid = /^\d{16}$/.test(cardNumber);
      const isExpiryDateValid = /^\d{2}\/\d{2}$/.test(expiryDate);
      const isCvcValid = /^\d{3}$/.test(cvc);
      const isNameValid = nameOnCard !== "";

      if (!isCardNumberValid) {
        showError(cardNumberInput, "Enter a valid card number");
      } else {
        clearError(cardNumberInput);
      }

      if (!isExpiryDateValid) {
        showError(expiryDateInput, "Enter a valid expiry date (MM/YY)");
      } else {
        clearError(expiryDateInput);
      }

      if (!isCvcValid) {
        showError(cvcInput, "Enter a valid CVC / CVV");
      } else {
        clearError(cvcInput);
      }

      if (!isNameValid) {
        showError(nameOnCardInput, "Enter the name on the card");
      } else {
        clearError(nameOnCardInput);
      }

      // Check if all fields are valid
      const isFormValid =
        isCardNumberValid && isExpiryDateValid && isCvcValid && isNameValid;

      return isFormValid;
    };

    const togglePayButton = () => {
      payBtn.disabled = !validateForm();
    };

    // Event listeners
    cardNumberInput.addEventListener("input", togglePayButton);
    expiryDateInput.addEventListener("input", togglePayButton);
    cvcInput.addEventListener("input", togglePayButton);
    nameOnCardInput.addEventListener("input", togglePayButton);
  }

  document
    .getElementById("purchaseForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      // Redirect to the confirmation page (Replace 'confirmationpage.html' with the actual URL)
      window.location.href = "confirmationpage.html";
    });
}

function gopayment() {
  window.location.href = "paymentspage.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const daysTag = document.querySelector(".days");
  const currentDate = document.querySelector(".current-date");
  const prevIcon = document.getElementById("prev");
  const nextIcon = document.getElementById("next");
  const dateSubmitBtn = document.getElementById("dateSubmitBtn"); // Reference to Submit Date button

  let selectedDate = null;
  let date = new Date();
  let currYear = date.getFullYear();
  let currMonth = date.getMonth();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function renderCalendar() {
    const firstDayofMonth = new Date(currYear, currMonth, 1).getDay();
    const lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
    const lastDayofMonth = new Date(
      currYear,
      currMonth,
      lastDateofMonth
    ).getDay();
    const lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) {
      liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
      let isToday =
        i === date.getDate() &&
        currMonth === date.getMonth() &&
        currYear === date.getFullYear()
          ? "active"
          : "";
      let isSelected =
        selectedDate &&
        i === selectedDate.getDate() &&
        currMonth === selectedDate.getMonth() &&
        currYear === selectedDate.getFullYear()
          ? "selected"
          : "";
      liTag += `<li class="${isToday} ${isSelected}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) {
      liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;
  }
  renderCalendar();

  // Previous and Next icons event listeners
  prevIcon.addEventListener("click", handlePrevNextIcon);
  nextIcon.addEventListener("click", handlePrevNextIcon);

  function handlePrevNextIcon(event) {
    currMonth = event.target.id === "prev" ? currMonth - 1 : currMonth + 1;

    if (currMonth < 0 || currMonth > 11) {
      date = new Date(currYear, currMonth, date.getDate());
      currYear = date.getFullYear();
      currMonth = date.getMonth();
    } else {
      date = new Date();
    }
    renderCalendar();
  }

  daysTag.addEventListener("click", (event) => {
    const selectedDay = event.target;
    if (selectedDay.classList.contains("inactive")) return;

    const day = parseInt(selectedDay.textContent);
    date = new Date(currYear, currMonth, day);

    selectDate(date);
    renderCalendar();
    dateSubmit();
    createsummary();
  });

  function selectDate(newDate) {
    selectedDate = newDate;
  }

  // Submit Date button click event
  function dateSubmit() {
    displaySelectedDate(selectedDate);
  }

  // Function to display the selected date
  function displaySelectedDate(date) {
    if (date) {
      formattedDate = formatDate(date);
      selectedflag = true;
    } else {
      selectedflag = false;
      formattedDate = "No date selected";
    }
  }

  // Function to format date as "day month year"
  function formatDate(date) {
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
    return `${day} ${month} ${year}`;
  }
});
