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
var logger = shim.NewLogger("main")

const prefixUser = "user."

//KYCChaincode represents chaincode object
type KYCChaincode struct {
}

var bcFunctions = map[string]func(shim.ChaincodeStubInterface, []string) peer.Response{
	// Insurance Peer
	// "contract_type_ls":         listContractTypes,
	// "contract_type_create":     createContractType,
	// "contract_type_set_active": setActiveContractType,
	// "contract_ls":              listContracts,
	// "claim_ls":                 listClaims,
	// "claim_file":               fileClaim,
	// "claim_process":            processClaim,
	"user_authenticate":        authUser,
	"user_get_info":            getUser,
	// // Shop Peer
	// "contract_create": createContract,
	"user_create":     createUser,
	// // Repair Shop Peer
	// "repair_order_ls":       listRepairOrders,
	// "repair_order_complete": completeRepairOrder,
	// // Police Peer
	// "theft_claim_ls":      listTheftClaims,
	// "theft_claim_process": processTheftClaim,
}

// Init callback representing the invocation of a chaincode
func (t *KYCChaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {
	_, args := stub.GetFunctionAndParameters()

	fmt.Println(args)

	if len(args) != 1 {
		return shim.Error("Invalid argument count.")
	}

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

// Invoke Function accept blockchain code invocations.
func (t *KYCChaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	function, args := stub.GetFunctionAndParameters()

	if function == "init" {
		return t.Init(stub)
	}
	bcFunc := bcFunctions[function]
	if bcFunc == nil {
		return shim.Error("Invalid invoke function.")
	}
	return bcFunc(stub, args)
}

func main() {
	logger.SetLevel(shim.LogInfo)

	err := shim.Start(new(KYCChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}