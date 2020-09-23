class Node {
  constructor(data, next = null) {
    this.data = data;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  // Insert first node
  insertFirst(data) {
    this.head = new Node(data, this.head);
    this.size++;
  }

  // Insert last node
  insertLast(data) {
    let node = new Node(data);
    let current;

    if(!this.head) {
      this.head = node;
    } else {
      current = this.head;

      while (current.next) {
        current = current.next;
      }
      current.next = node;
    }
    this.size++;
  }

  // Insert at index
  insertAt(index, data) {
    if (index > 0 && index > this.size) {
      return;
    }

    if (index == 0) {
      this.insertFirst(data);
      this.size++;
      return;
    }

    let node = new Node(data);
    let current, previous;

    current = this.head;
    let count = 0;
    while (count < index) {
      previous = current;
      count++;
      current = current.next;
    }

    node.next = current;
    previous.next = node;
    this.size++;
  }

  // Get value at index
  getAt(index) {
    let current = this.head;
    let count = 0;
    while (current) {
      if (count == index) {
        console.log(current.data);
        return;
      }
      count++;
      current = current.next;
    }
    return null;
  }

  // Remove at index
  removeAt(index) {
    if (index > 0 && index >= this.size) {
      return;
    }

    let current = this.head;
    let previous;
    if (index === 0) {
      this.head = current.next;
    } else {
      let count = 0;
      while (count < index) {
        previous = current;
        current = current.next;
        count++;
      }
      previous.next = current.next;
    }
    this.size--;
  }

  // Clear list data
  clearList() {
    this.head = null;
    this.size = 0;
  }
  // Print list data
  printListData() {
    let current = this.head;
    while (current) {
      console.log(current.data);
      current = current.next;
    }
  }
}

// TESTING
const ll = new LinkedList();
ll.insertFirst("harry");
ll.insertFirst("hermione");
ll.insertFirst("ron");
ll.insertLast("andrew");
ll.removeAt(4);
ll.clearList()
ll.printListData();
