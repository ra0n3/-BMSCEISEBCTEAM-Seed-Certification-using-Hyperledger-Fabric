package main

import (
	"fmt"
	// "strconv"

	// April 2020, Updated to Fabric 2.0 Shim
	"github.com/hyperledger/fabric/core/chaincode/shim"
	peer "github.com/hyperledger/fabric/protos/peer"

	// Conversion functions
	// "strconv"

	// JSON Encoding
	"encoding/json"
)

func createUser(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}
	fmt.Println(args)
	user := user{}
	err := json.Unmarshal([]byte(args[0]), &user)
	if err != nil {
		return shim.Error(err.Error())
	}

	key, err := stub.CreateCompositeKey(prefixUser, []string{user.Username})
	if err != nil {
		return shim.Error(err.Error())
	}

	// Check if the user already exists
	userAsBytes, _ := stub.GetState(key)
	// User does not exist, attempting creation
	if len(userAsBytes) == 0 {
		userAsBytes, err = json.Marshal(user)
		if err != nil {
			return shim.Error(err.Error())
		}

		err = stub.PutState(key, userAsBytes)
		if err != nil {
			return shim.Error(err.Error())
		}

		// Return nil, if user is newly created
		return shim.Success(nil)
	}

	err = json.Unmarshal(userAsBytes, &user)
	if err != nil {
		return shim.Error(err.Error())
	}

	userResponse := struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}{
		Username: user.Username,
		Password: user.Password,
	}

	userResponseAsBytes, err := json.Marshal(userResponse)
	if err != nil {
		return shim.Error(err.Error())
	}
	// Return the username and the password of the already existing user
	return shim.Success(userResponseAsBytes)
}

func getUser(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}
	fmt.Println("==========get User function==============")
	fmt.Println(args)

	input := struct {
		Username string `json:"username"`
	}{}

	err := json.Unmarshal([]byte(args[0]), &input)
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println([]string{input.Username})

	userKey, err := stub.CreateCompositeKey(prefixUser, []string{input.Username})
	if err != nil {
		return shim.Error(err.Error())
	}
	userBytes, _ := stub.GetState(userKey)
	if len(userBytes) == 0 {
		return shim.Success(nil)
	}

	response := struct {
		Username  string `json:"username"`
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
	}{}
	err = json.Unmarshal(userBytes, &response)
	if err != nil {
		return shim.Error(err.Error())
	}
	responseBytes, err := json.Marshal(response)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(responseBytes)
}

func authUser(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}

	input := struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}{}
	fmt.Println("Inside the authUser")

	authenticated := false

	err := json.Unmarshal([]byte(args[0]), &input)
	if err != nil {
		return shim.Error(err.Error())
	}

	userKey, err := stub.CreateCompositeKey(prefixUser, []string{input.Username})
	if err != nil {
		return shim.Error(err.Error())
	}
	userBytes, _ := stub.GetState(userKey)
	if len(userBytes) == 0 {
		authenticated = false
	} else {
		user := user{}
		err := json.Unmarshal(userBytes, &user)
		if err != nil {
			return shim.Error(err.Error())
		}
		authenticated = user.Password == input.Password
	}
	// // response := struct {
	// // 	Username        string `json:"username"`
	// // 	isAuthenticated bool `json:"isAuth"`
	// // }{}
	// // err = json.Unmarshal(userBytes, &response)
	// // if err != nil {
	// // 	return shim.Error(err.Error())
	// // }
	// // fmt.Println("Just Copy")
	// // response.isAuthenticated = authenticated
	// // fmt.Println(response.isAuthenticated)

	// // fmt.Println("Unmarshal")
	// //err = json.Unmarshal(authenticated, &response)
	// //fmt.Println(response.isAuthenticated)

	// //responseBytes, err := json.Marshal(response)
	// fmt.Println(string(responseBytes))

	// authBytes, _ := json.Marshal(response)

	// fmt.Println(string(authBytes))

	// return shim.Success(responseBytes)
	authBytes, _ := json.Marshal(authenticated)
	return shim.Success(authBytes)
}
