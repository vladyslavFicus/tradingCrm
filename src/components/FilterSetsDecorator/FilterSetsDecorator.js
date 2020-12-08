// import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';

// class FilterSetsDecorator extends PureComponent {
//   static propTypes = {
//     filterSetType: PropTypes.string.isRequired,
//     currentValues: PropTypes.object.isRequired,
//     isDataLoading: PropTypes.bool,
//     setFormValues: PropTypes.func.isRequired,
//     handleSubmit: PropTypes.func.isRequired,
//     handleReset: PropTypes.func.isRequired,
//   };

//   static defaultProps = {
//     isDataLoading: false,
//   };

//   state = {
//     selectedFilter: '',
//     isFilterSetsVisible: true,
//   };

//   selectFilter = uuid => this.setState({ selectedFilter: uuid });

//   toggleFilterSetsVisibility = () => (
//     this.setState(({ isFilterSetsVisible }) => ({
//       isFilterSetsVisible: !isFilterSetsVisible,
//     }))
//   );

//   renderFilterSetsButtons = () => {
//     const {
//       filterSetType,
//       currentValues,
//       handleReset,
//     } = this.props;

//     const { selectedFilter } = this.state;

//     return (
//       <FilterSetButtons
//         filterSetType={filterSetType}
//         currentValues={currentValues}
//         selectValue={selectedFilter}
//         resetForm={handleReset}
//         handleHistoryReplace={handleReset}
//         handleSelectFilterDropdownItem={this.selectFilter}
//       />
//     );
//   };

//   render() {
//     const {
//       filterSetType,
//       isDataLoading,
//       children,
//       handleSubmit,
//       setFormValues,
//     } = this.props;

//     const { isFilterSetsVisible } = this.state;

//     return (
//       <div className="FilterSetsDecorator">
//         <FilterSet
//           filterSetType={filterSetType}
//           selectValue={selectedFilter}
//           isDataLoading={isDataLoading}
//           submitFilters={handleSubmit}
//           handleHistoryReplace={setFormValues}
//           handleToggleFiltersVisibility={this.toggleFilterSetsVisibility}
//           handleSelectFilterDropdownItem={this.selectFilter}
//         />
//         <If condition={isFilterSetsVisible}>
//           {children({
//             renderFilterSetsButtons: this.renderFilterSetsButtons,
//           })}
//         </If>
//       </div>
//     );
//   }
// }

// export default FilterSetsDecorator;
