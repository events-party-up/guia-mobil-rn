// @flow
import React, { Component } from "react";
import { StyleSheet, ListView, View } from "react-native";
import { List, ListItem } from "react-native-elements";
import type NavigationScreenProp from "react-navigation";
import { connect } from "react-redux";
import * as actions from "../actions";
import { ICategory } from "../models";
import { getCategoriesWithParentId } from "../reducers";
import Header from "../components/Header";

type CategoriesListProps = {
	categories: ICategory[],
	navigation: NavigationScreenProp,
	updateCategoriesData: Function
};

class CategoriesList extends Component<CategoriesListProps> {
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
		this.props.updateCategoriesData();
	}
	componentWillReceiveProps(nextProps) {
		this.setCategories(nextProps.categories);
	}

	setCategories = categories => {
		this.setState({
			dataSource: this.state.dataSource.cloneWithRows(categories)
		});
	};

	navigateTo = (selectedCategory: ICategory) => {
		if (selectedCategory.children.length) {
			this.props.navigation.navigate("CategoriesList", {
				categories: selectedCategory.children,
				parentCategory: selectedCategory
			});
		} else {
			this.props.navigation.navigate("ItemsList", {
				categoryId: selectedCategory.id
			});
		}
	};

	renderRow = category => (
		<ListItem
			onPress={() => this.navigateTo(category)}
			key={category.id}
			title={category.name}
		/>
	);

	render() {
		return (
			<View style={styles.container}>
				<Header title="Categories" />
				<List style={styles.list}>
					<ListView
						dataSource={this.state.dataSource}
						renderRow={this.renderRow}
					/>
				</List>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	list: {
		flex: 1,
		backgroundColor: "transparent"
	},
	row: {
		height: 40,
		flexDirection: "row",
		alignItems: "center",
		padding: 4,
		borderWidth: 1
	}
});

const mapStateToProps = (state, { navigation, id }) => {
	if (navigation && navigation.state) {
		const { params } = navigation.state;
		if (params && params.categories)
			return {
				categories: params.categories
			};
	}
	return {
		categories: getCategoriesWithParentId(state, id)
	};
};

const mapDispatchToProps = (dispatch: Function) => ({
	updateCategoriesData: () => {
		dispatch(actions.categoriesUpdate());
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesList);
