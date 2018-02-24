import React, { Component } from "react";
import { View, StyleSheet, Text, ListView } from "react-native";
import { getCategories } from "../api";
import { List, ListItem } from "react-native-elements";
import * as actions from "../actions";
import { connect } from "react-redux";

class CategoriesList extends Component {
	static navigationOptions = ({ navigation }) => {
		const { params } = navigation.state;

		return {
			title:
				params && params.parentCategory
					? params.parentCategory.name
					: "Categories"
		};
	};

	constructor() {
		super();
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1.id !== r2.id
		});
		this.state = {
			dataSource: ds
		};
	}

	componentDidMount() {
		this.setCategories(this.props.categories);
	}
	componentWillReceiveProps(nextProps) {
		this.setCategories(nextProps.categories);
	}

	setCategories = categories => {
		this.setState({
			categories: categories,
			dataSource: this.state.dataSource.cloneWithRows(categories)
		});
	};

	renderRow = (category, sectionID) => {
		return (
			<ListItem
				onPress={() => this.navigateTo(category)}
				key={category.id}
				title={category.name}
			/>
		);
	};
	navigateTo = selectedCategory => {
		if (selectedCategory.children.length) {
			this.props.navigation.navigate("CategoriesList", {
				categories: selectedCategory.children,
				parentCategory: selectedCategory
			});
		} else {
			this.props.navigation.navigate("ItemsListView", {
				categoryId: selectedCategory.id
			});
		}
	};

	render() {
		return (
			<List style={styles.container}>
				<ListView
					dataSource={this.state.dataSource}
					renderRow={this.renderRow}
				/>
			</List>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	row: {
		height: 40,
		flexDirection: "row",
		alignItems: "center",
		padding: 4,
		borderWidth: 1
	}
});

const mapStateToProps = ({ categories }, ownProps) => {
	console.log({ ownProps });
	if (
		ownProps.navigation.state.params &&
		ownProps.navigation.state.params.categories
	) {
		return {
			categories: ownProps.navigation.state.params.categories
		};
	} else {
		return {
			categories
		};
	}
};

export default connect(mapStateToProps)(CategoriesList);
