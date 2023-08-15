import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SingleSelect, { Props } from './SingleSelect';

const options: Props<string>['options'] = [{
  label: 'Option 1',
  value: 'Value 1',
}, {
  label: 'Option 2',
  value: 'Value 2',
}, {
  label: 'Option 3',
  value: 'Value 3',
}];

it('Render SingleSelect', () => {
  render(
    <SingleSelect
      data-testid="select"
      options={options}
      value=""
    />,
  );

  expect(screen.getByText('Any')).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeEnabled();
  expect(screen.getByTestId('select')).toHaveValue('');
});

it('Render SingleSelect with placeholder', () => {
  const placeholder = 'Just select awesome options';

  render(
    <SingleSelect
      data-testid="select"
      placeholder={placeholder}
      options={options}
      value=""
    />,
  );

  expect(screen.queryByText('Any')).not.toBeInTheDocument();
  expect(screen.getByText(placeholder)).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeEnabled();
  expect(screen.getByTestId('select')).toHaveValue('');
});

it('Render SingleSelect with error', () => {
  const placeholder = 'Just select awesome options';
  const error = 'Options is required to save';

  render(
    <SingleSelect
      data-testid="select"
      placeholder={placeholder}
      options={options}
      error={error}
      value=""
    />,
  );

  expect(screen.queryByText('Any')).not.toBeInTheDocument();
  expect(screen.getByText(placeholder)).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeEnabled();
  expect(screen.getByTestId('select')).toHaveValue('');
  expect(screen.getByText(error)).toBeInTheDocument();
});

it('Render SingleSelect with loading state', () => {
  render(
    <SingleSelect
      loading
      data-testid="select"
      options={options}
      value=""
    />,
  );

  expect(screen.queryByText('Any')).not.toBeInTheDocument();
  expect(screen.getByTestId('CircleLoader')).toBeInTheDocument();
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeEnabled();
  expect(screen.getByTestId('select')).toHaveValue('');

  fireEvent.click(screen.getByText('Loading...'));

  expect(screen.getByTestId('ShortLoader')).toBeInTheDocument();
});

it('Render SingleSelect with disabled state', () => {
  render(
    <SingleSelect
      disabled
      data-testid="select"
      options={options}
      value=""
    />,
  );

  expect(screen.getByText('Any')).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeDisabled();
  expect(screen.getByTestId('select')).toHaveValue('');

  fireEvent.click(screen.getByText('Any'));

  // Check that menu not opened
  expect(screen.queryByTestId('single-select-menu')).not.toBeInTheDocument();
});

it('Render SingleSelect with value option', () => {
  const selectedOption = options[1];

  render(
    <SingleSelect
      data-testid="select"
      options={options}
      value={selectedOption.value}
    />,
  );

  expect(screen.queryByText('Any')).not.toBeInTheDocument();
  expect(screen.getByText(selectedOption.label)).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeInTheDocument();
  expect(screen.getByTestId('select')).toBeEnabled();
  expect(screen.getByTestId('select')).toHaveValue(selectedOption.value);
});

it('Render SingleSelect with label', () => {
  const label = 'My beautiful options';

  render(
    <SingleSelect
      label={label}
      options={options}
      value=""
    />,
  );

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.getByText('Any')).toBeInTheDocument();
  expect(screen.getByLabelText(label)).toBeEnabled();
  expect(screen.getByLabelText(label)).toHaveValue('');
});

it('Render SingleSelect with label and value option', () => {
  const label = 'My beautiful options';
  const selectedOption = options[1];

  render(
    <SingleSelect
      label={label}
      value={selectedOption.value}
      options={options}
    />,
  );

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.queryByText('Any')).not.toBeInTheDocument();
  expect(screen.getByText(selectedOption.label)).toBeInTheDocument();
  expect(screen.getByLabelText(label)).toBeEnabled();
  expect(screen.getByLabelText(label)).toHaveValue(selectedOption.value);
});

it('Render SingleSelect and open menu', () => {
  const label = 'My beautiful options';

  render(
    <SingleSelect
      label={label}
      options={options}
      value=""
    />,
  );

  // Show select menu
  fireEvent.click(screen.getByLabelText(label));

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.getByText('Any')).toBeInTheDocument();
  expect(screen.queryByText('Search')).not.toBeInTheDocument();

  // Check that all provided options are rendered
  options.forEach((option) => {
    expect(screen.getByText(option.label)).toBeInTheDocument();
  });
});

it('Render SingleSelect and select option', () => {
  const label = 'My beautiful options';
  const optionToSelect = options[0];

  render(
    <SingleSelect
      label={label}
      options={options}
      value=""
    />,
  );

  // Open select menu
  fireEvent.click(screen.getByLabelText(label));

  // Check that all the provided options are rendered
  options.forEach((option) => {
    const elements = screen.getAllByText(option.label);

    expect(elements[elements.length > 1 ? 1 : 0]).toBeInTheDocument();
  });

  // Select one option
  fireEvent.click(screen.getByText(optionToSelect.label));

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.getByText(optionToSelect.label)).toBeInTheDocument();
  expect(screen.queryByTestId('single-select-menu')).not.toBeInTheDocument();
});

it('Render SingleSelect with searchable input', () => {
  const label = 'My beautiful options';

  render(
    <SingleSelect
      searchable
      label={label}
      options={options}
      value=""
    />,
  );

  // Show select menu
  fireEvent.click(screen.getByLabelText(label));

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.getByText('Any')).toBeInTheDocument();
  expect(screen.getByTestId('single-select-menu-search-input')).toBeInTheDocument();

  // Check that all provided options are rendered
  options.forEach((option) => {
    expect(screen.getByText(option.label)).toBeInTheDocument();
  });
});

it('Render SingleSelect with searchable and filter options', () => {
  const label = 'My beautiful options';
  const search = '2';

  render(
    <SingleSelect
      searchable
      label={label}
      options={options}
      value=""
    />,
  );

  // Show select menu
  fireEvent.click(screen.getByLabelText(label));

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.getByText('Any')).toBeInTheDocument();
  expect(screen.getByTestId('single-select-menu-search-input')).toBeInTheDocument();

  // Check that all provided options are rendered
  options.forEach((option) => {
    expect(screen.getByText(option.label)).toBeInTheDocument();
  });

  fireEvent.input(screen.getByTestId('single-select-menu-search-input'), { target: { value: search } });

  // Check that options are filtered
  options.forEach((option) => {
    if (option.label.includes(search)) {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    } else {
      expect(screen.queryByText(option.label)).not.toBeInTheDocument();
    }
  });
});

it('Render SingleSelect with searchable and filter options with not found', () => {
  const label = 'My beautiful options';
  const search = 'No found option';

  render(
    <SingleSelect
      searchable
      label={label}
      options={options}
      value=""
    />,
  );

  // Show select menu
  fireEvent.click(screen.getByLabelText(label));

  expect(screen.getByLabelText(label)).toBeInTheDocument();
  expect(screen.getByText('Any')).toBeInTheDocument();
  expect(screen.getByTestId('single-select-menu-search-input')).toBeInTheDocument();

  // Check that all provided options are rendered
  options.forEach((option) => {
    expect(screen.getByText(option.label)).toBeInTheDocument();
  });

  fireEvent.input(screen.getByTestId('single-select-menu-search-input'), { target: { value: search } });

  expect(screen.getByText(`Available options by query "${search}" not found...`)).toBeInTheDocument();

  // Check that options are filtered
  options.forEach((option) => {
    expect(screen.queryByText(option.label)).not.toBeInTheDocument();
  });
});

it('Render SingleSelect and check onChange callback', () => {
  const label = 'My beautiful options';

  let selectedOption: string | undefined;

  render(
    <SingleSelect
      searchable
      label={label}
      options={options}
      onChange={(_selectedOption) => { selectedOption = _selectedOption; }}
      value=""
    />,
  );

  // Open select menu
  fireEvent.click(screen.getByLabelText(label));

  // Select one option
  fireEvent.click(screen.getByText(options[0].label));

  expect(screen.getByLabelText(label)).toBeInTheDocument();

  // Check that selected option have right value
  expect(screen.getByLabelText(label)).toHaveValue(options[0].value);
  expect(selectedOption).toEqual(options[0].value);

  // ================= //

  // Open select menu
  fireEvent.click(screen.getByLabelText(label));

  // Select second option
  fireEvent.click(screen.getByText(options[1].label));

  expect(screen.getByLabelText(label)).toHaveValue(options[1].value);
  expect(selectedOption).toEqual(options[1].value);

  // ================= //

  // Open select menu
  fireEvent.click(screen.getByLabelText(label));

  // Filter options with symbol "2"
  fireEvent.input(screen.getByTestId('single-select-menu-search-input'), { target: { value: '2' } });

  expect(screen.getByLabelText(label)).toHaveValue(options[1].value);
  expect(selectedOption).toEqual(options[1].value);
});
