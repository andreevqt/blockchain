const crypto = require(`crypto`);

class Block {
  constructor(index, timestamp, data, precedingHash = ``) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.precedingHash = precedingHash;
    this.hash = this.computeHash();
    this.nonce = 0;
  }

  proofOfWork(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.computeHash();
    }
  }

  computeHash() {
    const hash = crypto.createHash(`sha256`);
    const payload = `${this.index}${this.precedingHash}${this.timestamp}${JSON.stringify(this.data)}${this.nonce}`;

    return hash
      .update(payload)
      .digest(`hex`);
  }
}


class Blockchain {
  constructor(difficulty) {
    this._difficulty = difficulty;
    this._blockChain = this.createBlockchain();
  }

  createBlockchain() {
    return [new Block(0, `01/01/2021`, `Initial block in blockchain`, `0`)];
  }

  obtainedLastBlock() {
    return this._blockChain[this._blockChain.length - 1];
  }

  addNewBlock(newBlock) {
    newBlock.precedingHash = this.obtainedLastBlock().hash;
    newBlock.proofOfWork(this._difficulty);
    this._blockChain = [...this._blockChain, newBlock];
  }

  print() {
    for (let i = 0; i < this._blockChain.length; i++) {
      const block = this._blockChain[i];
      console.log(block);
    }
  }

  checkIntegrity(chain = this._blockChain) {
    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const precedingBlock = chain[i - 1];

      if (currentBlock.hash !== currentBlock.computeHash()) {
        return false;
      }

      if (currentBlock.precedingHash !== precedingBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

const blockchain = new Blockchain(6);

blockchain.addNewBlock(new Block(1, `01/06/2021`, {sender: `John Doe`, recepient: `Satoshi Nakomoto`, output: 14}));
blockchain.addNewBlock(new Block(2, `01/06/2021`, {sender: `John Doe`, recepient: `Tony Doe`, output: 15}));
blockchain.addNewBlock(new Block(3, `01/06/2021`, {sender: `John Doe`, recepient: `Alice`, output: 15}));

if (!blockchain.checkIntegrity()) {
  console.log(`Invalid blockchain`);
}

blockchain.print();
