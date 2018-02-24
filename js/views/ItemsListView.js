import React, { Component } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import Header from "../components/Header";
import type NavigationScreenProp from "react-navigation";
import * as actions from "../actions";

type Props = {
	items: any[],
	navigation: NavigationScreenProp
};

class ItemsListView extends Component<Props> {
	navigateTo = selectedItem => {
		this.props.navigation.navigate("ItemDetailsView", {
			id: selectedItem.id
		});
	};

	renderRow = item => (
		<ListItem
			onPress={() => this.navigateTo(item)}
			key={item.id}
			title={item.name}
			avatar={{
				uri: `https://bariloche.guiasmoviles.com/images/${item.image}`
			}}
		/>
	);

	render() {
		return (
			<View style={styles.container}>
				<Header title="Categories" />
				<ScrollView>
					<List style={styles.list}>
						{this.props.items.map(this.renderRow)}
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
		marginBottom: 50
	},
	row: {
		height: 40,
		flexDirection: "row",
		alignItems: "center",
		padding: 4,
		borderWidth: 1
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
