import { unlink, existsSync } from "fs";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

export default class DBContoller {
  //@FIXME: Change the duartion time
  static SIMULATION = {
    //duration in seconds
    duration: 60
  };

  static USERS = [
    { id: 0, name: "Store" },
    { id: 1, name: "Producer1", taken: false, ready: false },
    { id: 2, name: "Producer2", taken: false, ready: false },
    { id: 3, name: "FinalTaker" }
  ];

  static RESOURCES = [
    {
      userId: 0,
      qty: 1000000,
      deliveryTime: 20,
      toSell: 1000000,
      toBuy: 0
    },
    { userId: 1, qty: 0, deliveryTime: 30, toSell: 0, toBuy: 0 },
    {
      userId: 2,
      qty: 0,
      deliveryTime: 40,
      toSell: 0,
      toBuy: 0
    },
    { userId: 3, qty: 0, deliveryTime: 30, toSell: 0, toBuy: 0 }
  ];

  constructor(pathToDb) {
    this.pathToDb = pathToDb;

    const adapter = new FileSync(pathToDb);

    this.db = low(adapter);

    this.db
      .defaults({
        users: DBContoller.USERS,
        resources: DBContoller.RESOURCES,
        simulation: DBContoller.SIMULATION
      })
      .write();
  }

  deleteDB() {
    unlink(this.pathToDb, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("DB deletd");
      }
    });
  }

  get(field) {
    return this.db.get(field);
  }

  get resources() {
    return this.db.get("resources");
  }

  get simulation() {
    return this.db.get("simulation");
  }

  get users() {
    return this.db.get("users");
  }

  get players() {
    return this.users
      .filter(usr => usr.id !== 0)
      .filter(usr => usr.id !== this.users.value().length - 1);
  }

  getResourceByUser(userId) {
    return this.resources.find({ userId });
  }

  setResourceFieldByUser(userId, field, value) {
    this.getUserResource(userId)
      .assign({ [field]: value })
      .write();
  }

  getUser(id) {
    return this.users.find({ id });
  }

  setUserField(id, field, value) {
    this.getUser(id)
      .assign({ [field]: value })
      .write();
  }
}
