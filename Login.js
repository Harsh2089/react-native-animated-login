import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Platform } from 'react-native';

import Animated, { Easing } from 'react-native-reanimated';
import { TapGestureHandler, State, TextInput } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window');

const {
    Value,
    event,
    block,
    cond,
    eq,
    set,
    Clock,
    startClock,
    stopClock,
    debug,
    timing,
    clockRunning,
    interpolate,
    Extrapolate
} = Animated;

let device = Platform.OS;

function runTiming(clock, value, dest) {
    const state = {
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0)
    };

    const config = {
        duration: 1000,
        toValue: new Value(0),
        easing: Easing.inOut(Easing.ease)
    };

    return block([
        cond(clockRunning(clock), 0, [
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.frameTime, 0),
            set(config.toValue, dest),
            startClock(clock)
        ]),
        timing(clock, state, config),
        cond(state.finished, debug('stop clock', stopClock(clock))),
        state.position
    ]);
}

class Login extends Component {
    constructor() {
        super();

        this.animatedOpacity = new Value(1);

        this.onStateChange = event([
            {
                nativeEvent: ({ state }) =>
                    block([
                        cond(
                            eq(state, State.END),
                            set(this.animatedOpacity, runTiming(new Clock(), 1, 0))
                        )
                    ])
            }
        ]);

        this.onStateClose = event([
            {
                nativeEvent: ({ state }) =>
                    block([
                        cond(
                            eq(state, State.END),
                            set(this.animatedOpacity, runTiming(new Clock(), 0, 1))
                        )
                    ])
            }
        ]);

        this.animatedButton = interpolate(this.animatedOpacity, {
            inputRange: [0, 1],
            outputRange: [100, 0],
            extrapolate: Extrapolate.CLAMP
        });

        this.animatedImage = interpolate(this.animatedOpacity, {
            inputRange: [0, 1],
            outputRange: [-height / 2 - 200, 0],
            extrapolate: Extrapolate.CLAMP
        });

        this.animatedInputIndex = interpolate(this.animatedOpacity, {
            inputRange: [0, 1],
            outputRange: [1, -1],
            extrapolate: Extrapolate.CLAMP
        });

        this.animatedInputY = interpolate(this.animatedOpacity, {
            inputRange: [0, 1],
            outputRange: [0, 100],
            extrapolate: Extrapolate.CLAMP
        });

        this.animatedInputOpacity = interpolate(this.animatedOpacity, {
            inputRange: [0, 1],
            outputRange: [1, 0],
            extrapolate: Extrapolate.CLAMP
        });
    }


    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                    justifyContent: 'flex-end'
                }}
            >
                <Animated.View
                    style={{
                        ...StyleSheet.absoluteFill,
                        transform: [{ translateY: this.animatedImage }],
                    }}
                >
                    <Image
                        source={require('./assets/photo.jpeg')}
                        style={{ flex: 1, height: null, width: null, opacity: 0.7 }}
                    />
                </Animated.View>
                <View style={{ height: height - 50 , justifyContent: 'center' }}>
                    <TapGestureHandler onHandlerStateChange={this.onStateChange}>
                        <Animated.View
                            style={{
                                ...styles.button,
                                opacity: this.animatedOpacity,
                                transform: [{ translateY: this.animatedButton }]
                            }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>SIGN IN</Text>
                        </Animated.View>
                    </TapGestureHandler>
                    <Animated.View style={{
                        zIndex: this.animatedInputIndex,
                        opacity: this.animatedInputOpacity,
                        transform:[{translateY: this.animatedInputY}],
                        height: height / 2 + 200,
                        ...StyleSheet.absoluteFill,
                        top: null,
                        justifyContent: "center",
                    }}>
                        <Text style={styles.welcomeText}>
                            WELCOME !
                        </Text>
                        <TextInput 
                            placeholder="Email"
                            style={styles.textInput}
                            placeholderTextColor="black"
                        />
                        <TextInput 
                            placeholder="Password"
                            style={styles.textInput}
                            placeholderTextColor="black"
                        />
                        <TapGestureHandler onHandlerStateChange={this.onStateClose}>
                            <Animated.View style={[styles.button,{
                                backgroundColor: '#000',
                                top: 20
                            }]}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFF' }}>
                                    SIGN IN
                                </Text>
                            </Animated.View>
                        </TapGestureHandler>
                    </Animated.View>
                </View>
            </View>
        );
    }
}
export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        backgroundColor: 'white',
        height: 70,
        marginHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'black',
        shadowOpacity: 0.2
    },
    textInput: {
        height: 50,
        borderRadius: 10,
        borderWidth: 0.5,
        marginHorizontal: 20,
        paddingLeft: 10,
        marginVertical: 5,
        borderColor: 'rgba(0,0,0,0.2)'
    },
    closeButton: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: 'white',
        alignItems: "center",
        justifyContent: "center",
        position: 'absolute',
        top: -20,
        left: width/2 - 20,
        right: 0,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: 'black',
        shadowOpacity: 0.2
    },
    welcomeText: {
        top: -50,
        left: width/2 - 20,
        fontSize: 40,
        fontWeight: 'bold'
    }
});