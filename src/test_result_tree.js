function TestResultTree(name) {
  this.testCount = 0;
  this.assertionCount = 0;
  this.skipCount = 0;
  this.skips = [];
  this.failureCount = 0;
  this.failures = [];
  this.errors = [];
  this.errorCount = 0;
  this.testCount = 0;
  this.name = name;
}

chain(TestResultTree, TestResult);
TestResultTree.displayName = 'TestResultTree';

(function(p) {
  function addAssertion() {
    var node = this.currentNode;
    do {
      node.assertionCount++;
    } while (node = node.parent);
  }
  
  function addSkip(testcase, reason) {
    var node = this.currentNode;
    do {
      node.skipCount++;
      node.skips.push(reason);
    } while (node = node.parent);
  }
  
  function addFailure(testcase, reason) {
    var node = this.currentNode;
    do {
      node.failureCount++;
      node.failures.push(reason);
    } while (node = node.parent);
  }
  
  function addError(testcase, error) {
    var node = this.currentNode;
    do {
      node.errorCount++;
      node.errors.push(error);
    } while (node = node.parent);
  }
  
  function startTest(testcase) {
    var node = this.createChildNode(testcase.name);
    do {
      node.testCount++;
    } while (node = node.parent);
  }
  
  function stopTest(testcase) {
    this.currentNode = this.currentNode.parent || this;
  }
  
  function startSuite(suite) {
    this.createChildNode(suite.name);
  }
  
  function stopSuite(suite) {
    this.currentNode = this.currentNode.parent || this;
  }
  
  function start() {
    this.t0 = new Date();
    this.currentNode = this;
  }
  
  function stop() {
    this.currentNode = null;
    this.t1 = new Date();
  }
  
  function toString() {
    var results = '';
    if (this.children) {
      results += this.testCount;
      results += ' tests, ';
    }
    return results +
           this.assertionCount + ' assertions, ' +
           this.failureCount   + ' failures, ' +
           this.errorCount     + ' errors, ' +
           this.skipCount      + ' skips';
  }
  
  function createChildNode(name) {
    var node = new this.constructor(name);
    this.currentNode.appendChild(node);
    this.currentNode = node;
    return node;
  }
  
  function appendChild(child) {
    this.children = this.children || [];
    this.children.push(child);
    child.parent = this;
  }
  
  p.createChildNode = createChildNode;
  p.appendChild = appendChild;
  p.addAssertion = addAssertion;
  p.addSkip = addSkip;
  p.addFailure = addFailure;
  p.addError = addError;
  p.startTest = startTest;
  p.stopTest = stopTest;
  p.startSuite = startSuite;
  p.stopSuite = stopSuite;
  p.start = start;
  p.stop = stop;
  p.toString = toString;
})(TestResultTree.prototype);