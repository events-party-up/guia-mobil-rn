// @flow
import React, { Component } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { List, ListItem } from "react-native-elements";
import type NavigationScreenProp from "react-navigation";
import { connect } from "react-redux";
import * as actions from "../actions";
import { ICategory } from "../models";
import { getCategoriesWithParentId } from "../reducers";
import Header from "../components/Header";

type Props = {
	categories: ICategory[],
	navigation: NavigationScreenProp,
	updateCategoriesData: Function
};

class CategoriesList extends Component<Props> {
	componentDidMount() {
		this.props.updateCategoriesData();
	}

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
				<Header title="Categories" navItem={{ back: true }} />
				<ScrollView>
					<List style={styles.list}>
						{this.props.categories.map(this.renderRow)}
					</List>
				</ScrollView>
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
		backgroundColor: "transparent",
		marginTop: 0,
		marginBottom: 60
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
