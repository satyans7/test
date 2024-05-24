const dbController = require("../db-controller/db-controller");
const authController = require("../auth-controller/auth-controller")
class Controller {
  fetchSampleDataFromServer() {
    let data = dbController.fetchSampleDataFromServer();
    console.log(data);
    return data;
  }



  async registerUser(req, res) {
    const newUser=await dbController.postUserDataToServer(req.body);
    console.log(newUser);
    if(req.body.role==='admin'){
     await dbController.postUserRequestToServer(newUser,req.body.role);
    }
    
  }
  authenticateUser(formData) {
    try{
    let authResult =  authController.authenticateUser(formData);
       if (authResult.success) {
        let route = `/${authResult.role}-dashboard`
         return {success:true,route:route,message:`Logged In Successful`}
      } else {
        return {success:false,route:"null",message:"Invalid username or password!!!"};
      }
    } 
    catch (error) {
      
      return {success:false,route:'null',message:"Internal Server Error"};
    }
  };
  updateProfileOfUser() {
    let data = dbController.fetchSampleDataFromServer();
    console.log(data);
    return data;
  }
  fetchAllUsers() {
    let data = dbController.fetchAllUsers();
      // console.log(data);
      return data;
  }
  fetchRoleChangeReq() {
    let data = dbController.fetchRoleChangeReq();
      // console.log(data);
      return data;
  }
  fetchUserById(userId) {
    let data = dbController.fetchUserById(userId);
    // console.log(data);
    return data;
  }
  promoteUser() {
    let data = dbController.fetchSampleDataFromServer();
    console.log(data);
    return data;
  }
  requestRoleChange(req) {
    let userId=req.body._id;
    console.log(userId);
    const user=dbController.fetchUserById(userId);
    console.log(user);
    const reqRole=req.body.reqRole;
    console.log(reqRole)
    dbController.requestRoleChange(user,reqRole)
    // console.log(data);
    // return data;
  }


  deleteUserById(userId){
    return dbController.deleteUserById(userId);
  }
  
}
module.exports = new Controller();