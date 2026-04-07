// =====================================
// FIX 1: Using bind(this)
// =====================================
const timerBind = {
  seconds: 0,
  intervalId: null,

  start: function () {
    // FIX 1:
    // bind(this) ensures 'this' inside the callback refers to timerBind object
    this.intervalId = setInterval(function () {
      this.seconds++;
      console.log(`(bind) Elapsed: ${this.seconds}s`);
    }.bind(this), 1000);
  },

  stop: function () {
    clearInterval(this.intervalId);
    console.log("(bind) Timer stopped");
  }
};


// =====================================
// FIX 2: Using Arrow Function
// =====================================
const timerArrow = {
  seconds: 0,
  intervalId: null,

  start: function () {
    // FIX 2:
    // Arrow functions do NOT have their own 'this'
    // They inherit 'this' from surrounding scope (timerArrow)
    this.intervalId = setInterval(() => {
      this.seconds++;
      console.log(`(arrow) Elapsed: ${this.seconds}s`);
    }, 1000);
  },

  stop: function () {
    clearInterval(this.intervalId);
    console.log("(arrow) Timer stopped");
  }
};


// =====================================
// FIX 3: Using const self = this
// =====================================
const timerSelf = {
  seconds: 0,
  intervalId: null,

  start: function () {
    // FIX 3:
    // Store 'this' in a variable so callback can access correct reference
    const self = this;

    this.intervalId = setInterval(function () {
      self.seconds++;
      console.log(`(self) Elapsed: ${self.seconds}s`);
    }, 1000);
  },

  stop: function () {
    clearInterval(this.intervalId);
    console.log("(self) Timer stopped");
  }
};


// =====================================
// TESTING
// =====================================

// Run one at a time to observe clearly

// timerBind.start();
// setTimeout(() => timerBind.stop(), 4000);

// timerArrow.start();
// setTimeout(() => timerArrow.stop(), 4000);

timerSelf.start();
setTimeout(() => timerSelf.stop(), 4000);