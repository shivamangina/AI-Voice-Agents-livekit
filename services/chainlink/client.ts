import { ethers } from 'ethers';

// Chainlink Functions configuration
const CHAINLINK_FUNCTIONS_ROUTER = '0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C'; // Sepolia
const CHAINLINK_SUBSCRIPTION_ID = process.env.CHAINLINK_SUBSCRIPTION_ID || '1';

// Smart contract ABI (simplified for demo)
const CUSTOMER_SUPPORT_ORACLE_ABI = [
   'function startCall(string memory customerId) external returns (uint256)',
   'function logAgentAnalysis(uint256 callId, string memory agentType, string memory analysis, uint256 confidence) external',
   'function logComplianceFlag(uint256 callId, string memory violation, uint256 severity) external',
   'function logSalesOpportunity(uint256 callId, string memory product, uint256 estimatedValue, uint256 confidence) external',
   'function completeCall(uint256 callId, uint256 satisfaction, bool upsell) external',
   'event SupportCallStarted(uint256 indexed callId, address indexed agent, uint256 timestamp, string customerId)',
   'event AgentAnalysis(uint256 indexed callId, string agentType, string analysis, uint256 confidence, uint256 timestamp)',
   'event ComplianceFlag(uint256 indexed callId, string violation, uint256 severity, uint256 timestamp)',
   'event SalesOpportunity(uint256 indexed callId, string product, uint256 estimatedValue, uint256 confidence, uint256 timestamp)',
   'event CallCompleted(uint256 indexed callId, uint256 satisfaction, uint256 duration, bool upsell, uint256 timestamp)',
];

export class ChainlinkService {
   private provider: ethers.JsonRpcProvider;
   private contract: ethers.Contract | null = null;
   private wallet: ethers.Wallet | null = null;

   constructor() {
      // Initialize provider for Sepolia
      this.provider = new ethers.JsonRpcProvider(
         process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR-PROJECT-ID'
      );

      // Initialize wallet if private key is provided
      if (process.env.PRIVATE_KEY) {
         this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      }
   }

   /**
    * Initialize the smart contract connection
    */
   async initializeContract(contractAddress: string) {
      if (!this.wallet) {
         throw new Error('Wallet not initialized. Please provide PRIVATE_KEY in environment variables.');
      }

      this.contract = new ethers.Contract(
         contractAddress,
         CUSTOMER_SUPPORT_ORACLE_ABI,
         this.wallet
      );

      console.log('Chainlink service initialized with contract:', contractAddress);
   }

   /**
    * Start a call on the blockchain
    */
   async startCall(customerId: string): Promise<number> {
      if (!this.contract) {
         throw new Error('Contract not initialized');
      }

      try {
         const tx = await this.contract.startCall(customerId);
         const receipt = await tx.wait();

         // Parse the event to get the call ID
         const event = receipt.logs.find((log: any) =>
            log.eventName === 'SupportCallStarted'
         );

         if (event) {
            return event.args[0]; // callId
         }

         throw new Error('Call start event not found');
      } catch (error) {
         console.error('Error starting call on blockchain:', error);
         throw error;
      }
   }

   /**
    * Log agent analysis on the blockchain
    */
   async logAgentAnalysis(
      callId: number,
      agentType: string,
      analysis: string,
      confidence: number
   ): Promise<void> {
      if (!this.contract) {
         throw new Error('Contract not initialized');
      }

      try {
         const tx = await this.contract.logAgentAnalysis(
            callId,
            agentType,
            analysis,
            Math.floor(confidence * 100) // Convert to integer percentage
         );
         await tx.wait();
         console.log(`Agent analysis logged for call ${callId}`);
      } catch (error) {
         console.error('Error logging agent analysis:', error);
         throw error;
      }
   }

   /**
    * Log compliance flag on the blockchain
    */
   async logComplianceFlag(
      callId: number,
      violation: string,
      severity: number
   ): Promise<void> {
      if (!this.contract) {
         throw new Error('Contract not initialized');
      }

      try {
         const tx = await this.contract.logComplianceFlag(callId, violation, severity);
         await tx.wait();
         console.log(`Compliance flag logged for call ${callId}`);
      } catch (error) {
         console.error('Error logging compliance flag:', error);
         throw error;
      }
   }

   /**
    * Log sales opportunity on the blockchain
    */
   async logSalesOpportunity(
      callId: number,
      product: string,
      estimatedValue: number,
      confidence: number
   ): Promise<void> {
      if (!this.contract) {
         throw new Error('Contract not initialized');
      }

      try {
         const tx = await this.contract.logSalesOpportunity(
            callId,
            product,
            estimatedValue,
            Math.floor(confidence * 100) // Convert to integer percentage
         );
         await tx.wait();
         console.log(`Sales opportunity logged for call ${callId}`);
      } catch (error) {
         console.error('Error logging sales opportunity:', error);
         throw error;
      }
   }

   /**
    * Complete a call on the blockchain
    */
   async completeCall(
      callId: number,
      satisfaction: number,
      upsell: boolean
   ): Promise<void> {
      if (!this.contract) {
         throw new Error('Contract not initialized');
      }

      try {
         const tx = await this.contract.completeCall(callId, satisfaction, upsell);
         await tx.wait();
         console.log(`Call ${callId} completed on blockchain`);
      } catch (error) {
         console.error('Error completing call:', error);
         throw error;
      }
   }

   /**
    * Get call data from the blockchain
    */
   async getCall(callId: number): Promise<any> {
      if (!this.contract) {
         throw new Error('Contract not initialized');
      }

      try {
         const callData = await this.contract.getCall(callId);
         return callData;
      } catch (error) {
         console.error('Error getting call data:', error);
         throw error;
      }
   }

   /**
    * Get call statistics from the blockchain
    */
   async getStats(): Promise<any> {
      if (!this.contract) {
         throw new Error('Contract not initialized');
      }

      try {
         const stats = await this.contract.getStats();
         return {
            totalCalls: stats[0].toString(),
            totalComplianceFlags: stats[1].toString(),
            totalSalesOpportunities: stats[2].toString(),
         };
      } catch (error) {
         console.error('Error getting stats:', error);
         throw error;
      }
   }

   /**
    * Listen to blockchain events
    */
   async listenToEvents(callback: (event: any) => void): Promise<void> {
      if (!this.contract) {
         throw new Error('Contract not initialized');
      }

      // Listen to all relevant events
      this.contract.on('SupportCallStarted', callback);
      this.contract.on('AgentAnalysis', callback);
      this.contract.on('ComplianceFlag', callback);
      this.contract.on('SalesOpportunity', callback);
      this.contract.on('CallCompleted', callback);

      console.log('Listening to blockchain events...');
   }

   /**
    * Get recent events from the blockchain
    */
   async getRecentEvents(fromBlock: number = 0): Promise<any[]> {
      if (!this.contract) {
         throw new Error('Contract not initialized');
      }

      try {
         const currentBlock = await this.provider.getBlockNumber();
         const fromBlockNumber = fromBlock || Math.max(0, currentBlock - 1000); // Last 1000 blocks

         const events = await this.contract.queryFilter({}, fromBlockNumber, currentBlock);
         return events;
      } catch (error) {
         console.error('Error getting recent events:', error);
         throw error;
      }
   }
}

// Export singleton instance
export const chainlinkService = new ChainlinkService(); 