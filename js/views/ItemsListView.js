import React, { Component } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import type NavigationScreenProp from "react-navigation";
import * as actions from "../actions";
import Header from "../components/Header";
import ItemThumb from "../components/ItemThumb";

type Props = {
	items: any[],
	navigation: NavigationScreenProp
};

class ItemsListView extends Component<Props> {
	renderItemsGrid = (items: IItem[]) => (
			<View style={styles.grid}>
				{items.map(item => (
					<ItemThumb
						key={item.id}
						id={item.id}
						type="small"
						category={item.category_id}
						image={item.image}
						title={item.name}
						isFavorite={false}
						onPress={() =>
							this.props.navigation &&
							this.props.navigation.navigate("ItemDetailsView", {
								id: item.id
							})
						}
					/>
				))}
			</View>
		);

	render() {
		const { items } = this.props;
		return (
			<View style={styles.container}>
				<Header title="Categories" />
				<ScrollView style={styles.scrollView}>
					{this.renderItemsGrid(items)}
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	scrollView: {
		flex: 1
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between"
	}
});

const mapStateToProps = ({ items }, ownProps) => {
	if (
		ownProps.navigation.state.params &&
		ownProps.navigation.state.params.categoryId
	) {
		return {
			items:
				items.byCategoryId[ownProps.navigation.state.params.categoryId]
		};
	}
	return {
		items: []
	};
};

export default connect(mapStateToProps)(ItemsListView);
