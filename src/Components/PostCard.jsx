import { StyleSheet, Text, View, Image, Pressable  } from 'react-native'
import React from 'react'
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';



const PostCard = ({ post }) => {

const timeAgo = iso => {
    const seconds = Math.floor((new Date() - new Date(iso)) / 1000);

    if (seconds < 60) return 'Just now';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <View style={{flex:1}}>
      <View style={{height: 70, flexDirection:'row', padding:10 , justifyContent:'space-between' }}>
<View style={{flexDirection:'row'}}>
          <Image
        style={{
          height: 50,
          width: 50,
          borderRadius:100
        }}
        source={{
          uri: post.owner.profilePic.url || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        }}
        />
        <View style={{flexDirection:'column', gap:3, marginLeft:8, paddingTop:2}}>
          <Text style={{fontWeight:'600', fontSize:16}}>
            {post.owner.name}
          </Text>
          <Text style={{fontSize:13, color:'#777b7c'}}>
            {timeAgo(post.createdAt)}
          </Text>
        </View>
</View>
<View style={{flexDirection:'row', gap:20, marginTop:5}}>
<Pressable 
style={{backgroundColor:'#e7e7e7', marginBottom:14, paddingHorizontal:14, paddingVertical:5, borderRadius:10, elevation:3}}
>
  <Text style={{fontWeight:'600', fontSize:15}}>Follow</Text>
</Pressable>
<Pressable>
  <Entypo style={{marginTop:4}} name="dots-three-vertical" color="#5a5858" size={18} />
</Pressable>
</View>
      </View>
      <Image
      style={{
        height: 500,
       
      }}
      source={{
        uri: post.post.url
      }}
      />
      <View style={{height: 40, flexDirection:'row', justifyContent:'space-between', paddingHorizontal:8,paddingVertical:5, }}>
      <View style={{flexDirection:'row', gap:'15'}}>
      <View style={{flexDirection:'row', gap:'5'}}>
        <Feather name="thumbs-up" color="#000" size={24} />
        <Text style={{paddingTop:6}}>Vibe Up</Text>
        <Text style={{paddingTop:6, color:'#777b7c'}}>{post.vibesUp.length}</Text>
        
      </View>
      <View style={{flexDirection:'row', gap:'5'}}>
        <Feather style={{paddingTop:8}} name="thumbs-down" color="#000" size={24} />
        <Text style={{paddingTop:6}}>Vibe Down</Text>
      </View>
      </View>
      <View style={{flexDirection:'row', gap:'15', marginTop:6}}>
<MaterialIcons name="comment" color="#000" size={24} /> 
<Feather name="send" color="#000" size={24} />

      </View>
      </View>
      <View style={{flexDirection:'row', gap:'15', paddingLeft:9,marginBottom:20}} >
      <Text style={{fontSize:16, fontWeight:'600'}}>{post.owner.name}</Text>
      <Text style={{marginTop:3, color:'#767777'}}>{post.caption}</Text>
      </View>
    </View>
  )
}

export default React.memo(PostCard);

const styles = StyleSheet.create({})