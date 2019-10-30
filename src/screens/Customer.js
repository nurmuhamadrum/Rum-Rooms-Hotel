import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Header, Body, Title, Fab, Item, Input} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';

import {connect} from 'react-redux';
import {getAuthKey} from './../config/auth';
import {setHeaderAuth} from './../config/api';
import fetchCustomers from './../_store/customers';

import {METHOD_GET, METHOD_POST, METHOD_PUT} from './../config/constant';

class Customer extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      isLoading: true,
      isModalVisible: false,
      name: '',
      identity_number: '',
      phone_number: '',
      isModalEditVisible: false,
      idCustomer: '',
    };
  }

  componentDidMount() {
    this.handleData();
  }

  handleData = async () => {
    try {
      const user = await getAuthKey();
      setHeaderAuth(user.token);
      this.props.fetchCustomers(METHOD_GET);
    } catch (error) {
      console.log(error);
    }
  };

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  toggleModalEdit = (idCustomer, name, identity_number, phone_number) => {
    this.setState({
      idCustomer,
      name,
      identity_number,
      phone_number,
    });
    this.setState({isModalEditVisible: !this.state.isModalEditVisible});
  };

  handleAddCustomers = () => {
    if (
      (this.state.name, this.state.identity_number, this.state.phone_number)
    ) {
      return this.addData();
    } else {
      alert('Please Enter The Field!');
    }
  };

  addData = async () => {
    try {
      const data = await getAuthKey();
      setHeaderAuth(data.token);
      this.props.fetchCustomers(
        METHOD_POST,
        this.state.name,
        this.state.identity_number,
        this.state.phone_number,
      );
      this.toggleModal();
    } catch (error) {
      console.log(error);
    }
  };

  handleEditCustomers = () => {
    if (
      (this.state.name, this.state.identity_number, this.state.phone_number)
    ) {
      this.updateDataCustomer();
    } else {
      alert('Please Enter The Field!');
    }
  };

  updateDataCustomer = async () => {
    try {
      const data = await getAuthKey();
      setHeaderAuth(data.token);
      this.props.fetchCustomers(
        METHOD_PUT,
        this.state.name,
        this.state.identity_number,
        this.state.phone_number,
        this.state.idCustomer,
      );
      this.toggleModalEdit();
    } catch (error) {
      console.log(error);
    }
  };

  handleName = name => {
    this.setState({name});
  };

  handleIdentity = identity_number => {
    this.setState({identity_number});
  };

  handlePhone = phone_number => {
    this.setState({phone_number});
  };

  handleFlatlist = (id, name, idNum, phoneNum, image) => {
    return (
      <TouchableOpacity
        onPress={() => this.toggleModalEdit(id, name, idNum, phoneNum)}>
        <View
          style={{
            borderRadius: 5,
            marginBottom: 10,
            marginTop: 10,
            marginHorizontal: 15,
            backgroundColor: '#fafafa',
            elevation: 3,
            borderWidth: 0.5,
            borderColor: '#344DD5',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={{
                height: 75,
                width: 75,
                borderRadius: 5,
                marginTop: 7,
                marginLeft: 7,
                marginBottom: 7,
              }}
              source={{uri: image}}
            />
            <View style={{marginLeft: 20, marginTop: 13}}>
              <Text style={{fontSize: 20, color: 'black'}}>{name}</Text>
              <Text style={{color: 'black'}}>{idNum}</Text>
              <Text style={{color: 'black', fontSize: 15}}>{phoneNum}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {customers} = this.props;
    if (customers.error)
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontWeight: 'bold'}}>{customers.error.message}</Text>
        </View>
      );
    if (customers.isLoading)
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontWeight: 'bold'}}>Loading, Please Wait...</Text>
        </View>
      );

    return (
      <View style={style.container}>
        <Header style={{backgroundColor: '#344DD5'}}>
          <Body style={style.textHeader}>
            <Title>CUSTOMER</Title>
          </Body>
        </Header>
        <FlatList
          data={customers.data}
          renderItem={({item}) =>
            this.handleFlatlist(
              item.id,
              item.name,
              item.identity_number,
              item.phone_number,
              item.image,
            )
          }
          keyExtractor={item => item.id.toString()}
        />
        <Fab
          style={{backgroundColor: '#DC143C'}}
          onPress={this.toggleModal}
          position="bottomRight">
          <Icon name="plus" />
        </Fab>

        <View style={{flex: 1}}>
          <Modal isVisible={this.state.isModalVisible}>
            <View style={style.Modal}>
              <View style={{alignItems: 'center'}}>
                <Text style={style.modalText}>ADD NEW CUSTOMER</Text>
              </View>
              <View style={{marginHorizontal: 20, marginTop: 10}}>
                <Text style={style.RoomName}>Name*</Text>
                <Item style={style.inputRoom} regular>
                  <Input
                    placeholder="Enter the Customer Name..."
                    onChangeText={name => this.handleName(name)}
                  />
                </Item>
              </View>

              <View style={{marginHorizontal: 20, marginTop: 10}}>
                <Text style={style.RoomName}>Identity Number*</Text>
                <Item style={style.inputRoom} regular>
                  <Input
                    placeholder="Enter the Identity Number..."
                    onChangeText={identity => this.handleIdentity(identity)}
                  />
                </Item>
              </View>

              <View style={{marginHorizontal: 20, marginTop: 10}}>
                <Text style={style.RoomName}>Phone Number*</Text>
                <Item style={style.inputRoom} regular>
                  <Input
                    placeholder="Enter the Phone Number..."
                    onChangeText={phone => this.handlePhone(phone)}
                  />
                </Item>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  style={style.modalCancel}
                  title="Hide modal"
                  onPress={() => this.toggleModal()}>
                  <Text style={{color: 'white', fontSize: 18}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={style.modalSave}
                  onPress={() => this.handleAddCustomers()}>
                  <Text style={{color: 'white', fontSize: 18}}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        <View style={{flex: 1}}>
          <Modal isVisible={this.state.isModalEditVisible}>
            <View style={style.Modal}>
              <View style={{alignItems: 'center'}}>
                <Text style={style.modalText}>EDIT CUSTOMER</Text>
              </View>
              <View style={{marginHorizontal: 20, marginTop: 10}}>
                <Text style={style.RoomName}>Name*</Text>
                <Item style={style.inputRoom} regular>
                  <Input
                    placeholder="Enter the Customer Name..."
                    onChangeText={name => this.handleName(name)}
                  />
                </Item>
              </View>

              <View style={{marginHorizontal: 20, marginTop: 10}}>
                <Text style={style.RoomName}>Identity Number*</Text>
                <Item style={style.inputRoom} regular>
                  <Input
                    placeholder="Enter the Identity Number..."
                    onChangeText={identity => this.handleIdentity(identity)}
                  />
                </Item>
              </View>

              <View style={{marginHorizontal: 20, marginTop: 10}}>
                <Text style={style.RoomName}>Phone Number*</Text>
                <Item style={style.inputRoom} regular>
                  <Input
                    placeholder="Enter the Phone Number..."
                    onChangeText={phone => this.handlePhone(phone)}
                  />
                </Item>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  style={style.modalCancel}
                  title="Hide modal"
                  onPress={() => this.toggleModalEdit()}>
                  <Text style={{color: 'white', fontSize: 18}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={style.modalSave}
                  onPress={() => this.handleEditCustomers()}>
                  <Text style={{color: 'white', fontSize: 18}}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    );
  }
}

// export default Customer;

const mapStateToProps = state => {
  return {
    customers: state.customers,
  };
};

const mapDispatchToProps = {
  fetchCustomers,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Customer);

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  room: {
    flexDirection: 'row',
  },
  textHeader: {
    alignItems: 'center',
  },
  Modal: {
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    borderRadius: 5,
  },
  modalText: {
    marginTop: 15,
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
    alignContent: 'center',
  },
  inputRoom: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: 'black',
  },
  RoomName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
    marginBottom: 5,
  },
  modalSave: {
    backgroundColor: '#344DD5',
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginBottom: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  modalCancel: {
    backgroundColor: '#DC143C',
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginBottom: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});
