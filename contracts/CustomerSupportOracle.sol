// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

/**
 * @title CustomerSupportOracle
 * @dev Smart contract for logging customer support events and agent interactions
 * Uses Chainlink Functions for offchain computation and VRF for randomness
 */
contract CustomerSupportOracle is ConfirmedOwner, AutomationCompatible {
    
    // Events
    event SupportCallStarted(
        uint256 indexed callId,
        address indexed agent,
        uint256 timestamp,
        string customerId
    );
    
    event AgentAnalysis(
        uint256 indexed callId,
        string agentType,
        string analysis,
        uint256 confidence,
        uint256 timestamp
    );
    
    event ComplianceFlag(
        uint256 indexed callId,
        string violation,
        uint256 severity,
        uint256 timestamp
    );
    
    event SalesOpportunity(
        uint256 indexed callId,
        string product,
        uint256 estimatedValue,
        uint256 confidence,
        uint256 timestamp
    );
    
    event CallCompleted(
        uint256 indexed callId,
        uint256 satisfaction,
        uint256 duration,
        bool upsell,
        uint256 timestamp
    );

    // Structs
    struct CallData {
        uint256 callId;
        address agent;
        string customerId;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        uint256 satisfaction;
        bool hasUpsell;
    }
    
    struct AgentAnalysis {
        string agentType;
        string analysis;
        uint256 confidence;
        uint256 timestamp;
    }

    // State variables
    mapping(uint256 => CallData) public calls;
    mapping(uint256 => AgentAnalysis[]) public callAnalyses;
    mapping(uint256 => string[]) public complianceFlags;
    mapping(uint256 => string[]) public salesOpportunities;
    
    uint256 public nextCallId;
    uint256 public totalCalls;
    uint256 public totalComplianceFlags;
    uint256 public totalSalesOpportunities;
    
    // Chainlink VRF
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit
    ) ConfirmedOwner(msg.sender) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_subscriptionId = subscriptionId;
        i_gasLane = gasLane;
        i_callbackGasLimit = callbackGasLimit;
    }

    /**
     * @dev Start a new customer support call
     */
    function startCall(string memory customerId) external returns (uint256) {
        uint256 callId = nextCallId++;
        
        calls[callId] = CallData({
            callId: callId,
            agent: msg.sender,
            customerId: customerId,
            startTime: block.timestamp,
            endTime: 0,
            isActive: true,
            satisfaction: 0,
            hasUpsell: false
        });
        
        totalCalls++;
        
        emit SupportCallStarted(callId, msg.sender, block.timestamp, customerId);
        
        return callId;
    }

    /**
     * @dev Log agent analysis results
     */
    function logAgentAnalysis(
        uint256 callId,
        string memory agentType,
        string memory analysis,
        uint256 confidence
    ) external {
        require(calls[callId].isActive, "Call not active");
        
        AgentAnalysis memory newAnalysis = AgentAnalysis({
            agentType: agentType,
            analysis: analysis,
            confidence: confidence,
            timestamp: block.timestamp
        });
        
        callAnalyses[callId].push(newAnalysis);
        
        emit AgentAnalysis(callId, agentType, analysis, confidence, block.timestamp);
    }

    /**
     * @dev Log compliance violations
     */
    function logComplianceFlag(
        uint256 callId,
        string memory violation,
        uint256 severity
    ) external {
        require(calls[callId].isActive, "Call not active");
        
        complianceFlags[callId].push(violation);
        totalComplianceFlags++;
        
        emit ComplianceFlag(callId, violation, severity, block.timestamp);
    }

    /**
     * @dev Log sales opportunities
     */
    function logSalesOpportunity(
        uint256 callId,
        string memory product,
        uint256 estimatedValue,
        uint256 confidence
    ) external {
        require(calls[callId].isActive, "Call not active");
        
        salesOpportunities[callId].push(product);
        totalSalesOpportunities++;
        
        emit SalesOpportunity(callId, product, estimatedValue, confidence, block.timestamp);
    }

    /**
     * @dev Complete a call with satisfaction score
     */
    function completeCall(
        uint256 callId,
        uint256 satisfaction,
        bool upsell
    ) external {
        require(calls[callId].isActive, "Call not active");
        require(satisfaction <= 10, "Satisfaction must be 0-10");
        
        CallData storage call = calls[callId];
        call.endTime = block.timestamp;
        call.isActive = false;
        call.satisfaction = satisfaction;
        call.hasUpsell = upsell;
        
        uint256 duration = call.endTime - call.startTime;
        
        emit CallCompleted(callId, satisfaction, duration, upsell, block.timestamp);
    }

    /**
     * @dev Get call data
     */
    function getCall(uint256 callId) external view returns (CallData memory) {
        return calls[callId];
    }

    /**
     * @dev Get all analyses for a call
     */
    function getCallAnalyses(uint256 callId) external view returns (AgentAnalysis[] memory) {
        return callAnalyses[callId];
    }

    /**
     * @dev Get compliance flags for a call
     */
    function getComplianceFlags(uint256 callId) external view returns (string[] memory) {
        return complianceFlags[callId];
    }

    /**
     * @dev Get sales opportunities for a call
     */
    function getSalesOpportunities(uint256 callId) external view returns (string[] memory) {
        return salesOpportunities[callId];
    }

    /**
     * @dev Get call statistics
     */
    function getStats() external view returns (
        uint256 _totalCalls,
        uint256 _totalComplianceFlags,
        uint256 _totalSalesOpportunities
    ) {
        return (totalCalls, totalComplianceFlags, totalSalesOpportunities);
    }

    // Chainlink Automation functions
    function checkUpkeep(
        bytes calldata /* checkData */
    ) external view override returns (bool upkeepNeeded, bytes memory /* performData */) {
        // Check if there are any active calls that need monitoring
        upkeepNeeded = false;
        for (uint256 i = 0; i < nextCallId; i++) {
            if (calls[i].isActive && (block.timestamp - calls[i].startTime) > 300) { // 5 minutes
                upkeepNeeded = true;
                break;
            }
        }
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        // This could trigger additional monitoring or alerts
        // For now, just emit an event
    }
} 