const { expect } = require("chai");
const sinon = require("sinon");
const { saveUser, getUser } = require("../src/services/user.service");
const connectionFactory = require("../app");

const { User } = require("../src/models/user.model");

describe("User Service Unit Tests", function () {
  this.afterEach(() => {
    sinon.restore();
  });

  describe("Save User functionality", function () {
    it("should successfully add a user if the number of users in the DB with the same profiled is zero", async function () {
      this.timeout(0);
      const profileId = 1;
      const name = "Akshay";
      const dob = "2020-12-12";
      const experience = [{ years: 2, organizationName: "ABCD" }];
      sinon.stub(User, "countDocuments").returns(0);
      sinon.stub(User.prototype, "save").returns({ name, dob, experience });
      const returnedUser = await saveUser({
        profileId,
        name,
        dob,
        experience,
      });
      expect(returnedUser.name).to.equal(name);
      expect(returnedUser.dob.toString()).to.equal(new Date(dob).toString());
      experience.map((exp, index) => {
        expect(returnedUser.experience[index].years).to.equal(exp.years);
        expect(returnedUser.experience[index].organizationName).to.equal(
          exp.organizationName
        );
      });
    });
    it("should throw an error if the number of users with the same profileId is not zero", async function () {
      const profileId = 1;
      const name = "Akshay";
      const dob = "2020-12-12";
      const experience = [{ years: 2, organizationName: "ABCD" }];
      sinon.stub(User, "countDocuments").returns(0);
      await saveUser({
        profileId,
        name,
        dob,
        experience,
      }).catch((error) => {
        expect(error.message).to.equal("User with profileId already exists");
      });
    });
  });
  describe("Get User functionality", function () {
    it("should return correct age and experience of the user after calculation", async function () {
      const profileId = 1;
      const fakeObject = {
        _id: 1,
        name: "Akshay",
        dob: "2020-12-12",
        experience: [{ years: 5, organizationName: "ABCD" }],
      };
      sinon.stub(User, "findOne").returns(fakeObject);
      const returnedUser = await getUser({
        profileId,
      });
      expect(returnedUser.name).to.equal(fakeObject.name);
      expect(returnedUser.age).to.equal(1);
      expect(returnedUser.totalExperience).to.eql(5);
    });
    it("should give error if invalid if there is no user found with provided profileId", async function () {
      const profileId = 1;
      sinon.stub(User, "findOne").returns(null);
      await getUser({
        profileId,
      }).catch((error) => {
        expect(error.message).to.equal(
          "No user not found with given profileId"
        );
      });
    });
  });
});
