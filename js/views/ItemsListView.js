import React, { Component } from "react";
import { View, StyleSheet, ListView } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import * as actions from "../actions";

class ItemsListView extends Component {
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
		this.setItems(this.props.items);
	}
	componentWillReceiveProps(nextProps) {
		this.setItems(nextProps.items);
	}

	setItems = items => {
		this.setState({
			items: items,
			dataSource: this.state.dataSource.cloneWithRows(items)
		});
	};

	renderRow = (item, sectionID) => {
		return (
			<ListItem
				onPress={() => this.navigateTo(item)}
				key={item.id}
				title={item.name}
				avatar={{
					uri: `https://bariloche.guiasmoviles.com/images/${
						item.image
					}`
				}}
			/>
		);
	};
	navigateTo = selectedItem => {
		console.log({ selectedItem });
		this.props.navigation.navigate("ItemDetailsView", {
			id: selectedItem.id
		});
	};

	render() {
		return (
			<View>
				<List style={styles.container}>
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
	} else {
		return {
			items: []
		};
	}
};

export default connect(mapStateToProps)(ItemsListView);
