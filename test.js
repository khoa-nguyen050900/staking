const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)


ffmpeg('test2.mp4')
          .outputOptions('-f segment')
          .outputOptions('-c copy')
          .outputOptions('-map 0')
          .outputOptions('-reset_timestamps 1')
          .outputOptions(`-segment_time 00:00:03`).save(`./video/out%03d.mp4`)
          .on('end', function(err) {
          if(!err) { console.log('conversion Done') }
          })
          .on('error', function(err){
          console.log('error: ', err)
          }).run()