import { StyleSheet, Text, TextInput, View, FlatList, Dimensions, Image  } from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';


const { width } = Dimensions.get("window");

const SMALL = width / 3;
const BIG_WIDTH = width / 3;
const BIG_HEIGHT = SMALL * 2;
const SPACING = 2;


const DATA = Array.from({ length: 30 }).map((_, i) => ({
  id: i.toString(),
  image: `https://picsum.photos/500/500?random=${i}`
}));

const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const Search = () => {
  const groupedData = chunkArray(DATA, 10);

  const renderBlock = ({ item }) => {
  if (item.length < 10) return null;

  return (
    <>
      <View style={styles.block}>
        <View>
          <View style={{ flexDirection: "row" }}>
            <Image source={{ uri: item[0].image }} style={styles.small} />
            <Image source={{ uri: item[1].image }} style={styles.small} />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Image source={{ uri: item[2].image }} style={styles.small} />
            <Image source={{ uri: item[3].image }} style={styles.small} />
          </View>
        </View>

        <Image source={{ uri: item[4].image }} style={styles.big} />
      </View>

      <View style={styles.block}>
        <Image source={{ uri: item[5].image }} style={styles.big} />

        <View>
          <View style={{ flexDirection: "row" }}>
            <Image source={{ uri: item[6].image }} style={styles.small} />
            <Image source={{ uri: item[7].image }} style={styles.small} />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Image source={{ uri: item[8].image }} style={styles.small} />
            <Image source={{ uri: item[9].image }} style={styles.small} />
          </View>
        </View>
      </View>
    </>
  );
};


  return (
    <FlatList
      data={groupedData}
      ListHeaderComponent={
        <View style={styles.Search}>
        <AntDesign name="search1" color="#797979" size={20} />
        <TextInput
          style={{ fontSize: 16, fontWeight:'400' }}
          placeholder="Search the viber ..."
        />
      </View>
      }
      renderItem={renderBlock}
      keyExtractor={(item, index) => index.toString()}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default Search;

const styles = StyleSheet.create({
  Search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6eaec',
    gap: 3,
    marginTop: 5,
    marginHorizontal: 10,
    borderRadius:25,
    paddingLeft:10,
    paddingVertical:3,
    marginBottom:6
  },
  block: {
  flexDirection: "row",
  backgroundColor: "white", 
},

small: {
  width: SMALL - SPACING,
  height: SMALL - SPACING,
  margin: SPACING / 2,
  resizeMode: "cover",
},

big: {
  width: BIG_WIDTH - SPACING,
  height: BIG_HEIGHT - SPACING,
  margin: SPACING / 2,
  resizeMode: "cover",
},

});
