// Abstract class
export default class SourceProvider {
  constructor() {
    this.getData = this.getData.bind(this);
  }
  async getData() {
    throw Error("It is abstract class methode, you need to override it");
  }
}
