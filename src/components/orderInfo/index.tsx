import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Block, Text } from '@tarojs/components';
import './index.less'
import MovieImg from '../movieImg/index';
import { orderData, FilmsData, CinemaData } from '../../store/movies/interface';
import { ScheduleData } from '../../store/seat/interface';
type Props = {
  info: orderData,
  film: FilmsData,
  schedule: ScheduleData,
  cinema: CinemaData,
  otherClass?: string,
}

interface orderInfo{
  props: Props,
}

class orderInfo extends Component {
  static externalClasses = ['outer-class']
  render() {
    const { info, film, schedule, cinema, otherClass } = this.props
    return (
      <View className={`orderInfo ${otherClass}`}>
        {
          film&&
          <MovieImg url={film.imageUrl}></MovieImg>
        }
        <View className="info">
          <View className="name">{film.name}<Text>{info.count}张</Text></View>
          <View className="date">
            <Text>{schedule.showDate}</Text>
            <Text>{schedule.showTime}-{schedule.endTime}</Text>
            <Text>{schedule.showVersion}</Text>
          </View>
          <View className="address">
            <Text>{cinema.cinemaName}</Text>
            <Text>{schedule.hallName}</Text>
          </View>
          <View className="seat">
            {
              info.seatNames.map((item,index) => {
                return (
                  <Text key={index}>{item} </Text>
                )
              })
            }
          </View>
        </View>
      </View>
    )
  }
}

export default orderInfo