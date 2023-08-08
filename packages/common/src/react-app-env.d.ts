/// <reference types="react-scripts" />

// ==== Conditional rendering declarations ==== //
declare let If: React.FC<{ condition: boolean }>;
declare let Choose: React.FC;
declare let When: React.FC<{ condition: boolean }>;
declare let Otherwise: React.FC;
