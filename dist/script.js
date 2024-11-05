window.onload = () => {
  const setupPage = document.getElementById("setup-page");
  const gamePage = document.getElementById("game-page");
  const playGameButton = document.getElementById("play-game");
  const promptsForm = document.getElementById("prompts-form");
  const display = document.querySelector(".display");

  const prompts = [];

  // When "Play the Game" is clicked
  playGameButton.addEventListener("click", () => {
    // Collect all the prompt inputs
    for (let i = 0; i <= 9; i++) {
      const promptValue = document.getElementById(`prompt-${i}`).value || "No task provided";
      prompts.push(promptValue);  // Save the prompt for each floor
    }

    // Hide the setup page and show the game page
    setupPage.style.display = "none";
    gamePage.style.display = "block";
  });

  // Add event listeners for floor buttons
  const buttons = document.querySelectorAll(".btn-floor");
  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const floor = this.getAttribute("data-set-floor");
      const promptMessage = prompts[floor];
      display.innerHTML = `Floor ${floor}: ${promptMessage}`;
    });
  });
};

window.onload = () => {
  let elevator = document.querySelector(".elevator");
  let elevatorDoor = elevator.querySelector(".elevator-door");
  let elevatorLight = elevator.querySelector(".elevator-light");
  let floors = document.querySelectorAll(".building .floor");
  let buttons = document.querySelectorAll(".handle button");
  let display = document.querySelector(".display");

  var destinyFloors = [];
  var currentFloor = null;
  var leavingFloor = false;
  var elevatorStatus = 'idle';
  var elevatorWaitingTime = 2000;
  var elevatorWaitTime = 2000;
  var previousTime = new Date().getTime();
  var deltaTime = 0;

  elevatorDoor.style.width = "1px";
  elevator.style.offsetTop = floors[0].offsetTop + "px";
  // moving, opening, waiting, closing, idle

  buttons.forEach(button => {
    button.addEventListener("click", function () {
      let setFloor = this.getAttribute("data-set-floor");
      let selectedFloor = Array.prototype.slice.apply(
      document.querySelectorAll(".building .floor")).
      filter(f => f.getAttribute("data-floor") == setFloor)[0];

      if (destinyFloors.find(df => df.getAttribute("data-floor") == selectedFloor.getAttribute("data-floor")) == null) {
        if (selectedFloor.getAttribute("data-floor") != currentFloor.getAttribute("data-floor")) {
          destinyFloors.push(selectedFloor);
        }
      }
      leavingFloor = true;
      if (elevatorStatus == 'idle') {
        elevatorStatus = 'closing';
      }
    });
  });

  function updateElevator() {
    deltaTime = new Date().getTime() - previousTime;
    previousTime = new Date().getTime();

    requestAnimationFrame(updateElevator);
    // console.log(elevator.offsetTop)
    var elevatorWithinFloor = false;
    for (let i = 0; i < floors.length; i++) {
      if (elevator.offsetTop > floors[i].offsetTop && elevator.offsetTop < floors[i].offsetTop + 10) {
        // console.log("elevator within floor "+i);
        elevatorWithinFloor = true;
        currentFloor = floors[i];

        if (!leavingFloor) {
          if (destinyFloors.some(df => df.getAttribute("data-floor") == currentFloor.getAttribute("data-floor"))) {
            // console.log("Reached floor")
            destinyFloors = destinyFloors.filter(df => df.getAttribute("data-floor") != currentFloor.getAttribute("data-floor"));
            elevatorStatus = 'opening';
          }

        } else {
          // console.log("Leaving floor")
        }
      }
    }

    if (!elevatorWithinFloor) {
      // console.log("Elevator out of any floor")
      if (leavingFloor) {
        leavingFloor = false;
      }
    }

    if (elevatorStatus != 'moving') {
      if (elevatorStatus == 'opening') {
        if (elevatorDoor.offsetWidth > 1) {
          elevatorDoor.style.width = elevatorDoor.offsetWidth - 1 + "px";
        } else {
          if (destinyFloors.length == 0) {
            elevatorStatus = 'idle';
          } else {
            elevatorStatus = 'waiting';
            elevatorWaitingTime = elevatorWaitTime;
          }
        }
      }
      if (elevatorStatus == 'waiting') {
        if (elevatorWaitingTime > 0) {
          elevatorWaitingTime -= deltaTime;
        } else {
          elevatorStatus = 'closing';
        }
      }
      if (elevatorStatus == 'closing') {
        if (elevatorDoor.offsetWidth < 34) {
          elevatorDoor.style.width = elevatorDoor.offsetWidth + 1 + "px";
        } else {
          elevatorStatus = 'moving';
        }
      }
    }

    if (destinyFloors[0] != null && elevatorStatus == 'moving') {
      if (destinyFloors[0].offsetTop > elevator.offsetTop - 7) {
        elevator.style.top = elevator.offsetTop - 7 + 2 + "px";
      } else {
        elevator.style.top = elevator.offsetTop - 7 - 2 + "px";
      }
    }

    updateButtons();
    updateDisplay();
  }
  updateElevator();

  function updateDisplay() {
  display.innerHTML = [
    "Ground Floor",
    "First Floor",
    "Second Floor",
    "Third Floor",
    "Fourth Floor",
    "Fifth Floor",
    "Sixth Floor",
    "Seventh Floor",
    "Eighth Floor",
    "Ninth Floor"
  ][parseInt(currentFloor.getAttribute("data-floor"))] + " " + (
    destinyFloors[0] != null ?
    destinyFloors[0].offsetTop < currentFloor.offsetTop ?
    '<br />Going Up' :
    '<br />Going Down' :
    ''
  );
}

  function updateButtons() {
    buttons.forEach(button => {
      if (destinyFloors.find(df => df.getAttribute("data-floor") == button.getAttribute("data-set-floor"))) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  }
};