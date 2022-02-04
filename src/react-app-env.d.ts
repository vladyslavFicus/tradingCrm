/* eslint-disable */

// ==== Conditional rendering declarations ==== //
declare var If: React.FC<{ condition: boolean }>;
declare var Choose: React.FC;
declare var When: React.FC<{ condition: boolean }>;
declare var Otherwise: React.FC;

// Extract single type from array when requested array of types
type ExtractApolloTypeFromArray<T> = NonNullable<NonNullable<T>[number]>;
