import React, { Component, useState } from "react";
import "dhtmlx-scheduler";
import "dhtmlx-scheduler/codebase/dhtmlxscheduler_material.css";
import { weekdays } from "jalali-moment";
// import { addTeacherFreeTime } from "../../../../Redux/teacherFreeTime/teacherFreeTimeSlice";
import moment from "jalali-moment";
moment.locale("fa");
const m = moment();
class Scheduler extends Component {
    state = { day: "", hour_range: [], dataFromServer: [], sendData: [] };
    static getDerivedStateFromProps(props, state) {
        if (props.dataFromServer !== state.dataFromServer) {
            return {
                dataFromServer: props.dataFromServer,
            };
        }
        // Return null if the state hasn't changed
        return null;
    }

    initSchedulerEvents() {
        if (scheduler._$initialized) {
            return;
        }

        const onDataUpdated = this.props.onDataUpdated;

        scheduler.attachEvent("onEventAdded", (id, ev) => {
            //console.log(this.state.dataFromServer);
            if (onDataUpdated) {
                //**********day */
                var now = moment(new Date(2020, 2, 7)); //todays date
                var end = moment(ev.start_date); // another date
                var duration = moment.duration(end.diff(now));
                var diffDays = Math.abs(Math.round(duration.asDays()));
                this.setState({ day: `${diffDays}` });

                //************hour */

                var startEv = moment(ev.start_date);
                var endEv = moment(ev.end_date);
                var hourDuration = moment.duration(startEv.diff(endEv));

                var diffHours = Math.abs(hourDuration.asHours());

                var startHour = moment.from(ev.start_date).format("HH:mm");
                var hh = moment.from(ev.start_date).format("HH");
                var mm = moment.from(ev.start_date).format("mm");
                var startKooft = 0;

                if (mm == 30) {
                    startKooft = 2 * hh + 2;
                } else {
                    startKooft = 2 * hh + 1;
                }

                for (let i = 0; i < diffHours * 2; i++) {
                    this.setState({
                        hour_range: [...this.state.hour_range, startKooft],
                    });

                    startKooft += 1;
                }

                onDataUpdated("create", ev, id);

                let x = this.findIndexIfObjWithAttr(
                    this.state.dataFromServer,
                    "day",
                    Number(this.state.day)
                );
                console.log(this.state.dataFromServer);

                // this.dataFromServer.map(function(data){this.setState({dataFromServer: day:""})})

                let oldHourRange = this.state.dataFromServer[x].hour_range;
                console.log(oldHourRange);
                oldHourRange = [...oldHourRange, ...this.state.hour_range];

                console.log(oldHourRange);

                let oldDataServer = this.state.dataFromServer;
                oldDataServer[x].hour_range = oldHourRange;

                this.setState({ dataFromServer: oldDataServer });
                this.setState({ sendData: oldDataServer[x] });
                // this.onAddTeacherFreeTime();

                // console.log(this.state.sendData);
                // });

                this.setState({ day: "", hour_range: [], sendData: {} });

                // this.state.dataFromServer.map(function (data) {
                //
                //     this.setState({ day: "", hour_range: [] });
                //   }

                //   this.setState({
                //     dataFromServer: [
                //       ...this.state.dataFromServer,
                //       {
                //         day: this.state.day,
                //         hour_range: this.state.hour_range,
                //       },
                //     ],
                //   });
                // });

                // console.log(moment.from(ev.start_date).format("yyy-dddd-mmm"));
            }
        });

        scheduler.attachEvent("onEventChanged", (id, ev) => {
            if (onDataUpdated) {
                onDataUpdated("update", ev, id);
            }
        });

        scheduler.attachEvent("onEventDeleted", (id, ev) => {
            if (onDataUpdated) {
                onDataUpdated("delete", ev, id);
            }
        });
        scheduler._$initialized = true;
    }

    componentDidMount() {
        scheduler.skin = "material";
        scheduler.config.header = [
            "day",
            "week",
            // "month",
            "date",
            "prev",
            "today",
            "next",
        ];
        // scheduler.config.agenda_start = new Date(2022, 19, 3);
        // scheduler.config.agenda_end = new Date(2022, 9, 3);

        scheduler.config.icons_select = ["icon_delete"];

        scheduler.config.hour_date = "%g:%i %A";
        scheduler.xy.scale_width = 70;
        scheduler.config.event_duration = 30;
        scheduler.config.timeline_swap_resize = false;
        scheduler.config.time_step = 30;
        // scheduler.config.displayed_event_color= "#000";
        scheduler.config.positive_closing = true;
        scheduler.config.start_on_today = true;
        scheduler.xy.min_event_height = 35;
        scheduler.config.first_hour = 6;
        scheduler.config.last_hour = 22;
        scheduler.config.rtl = true;
        scheduler.config.collision_limit = 1;

        scheduler.templates.day_date = function (date) {
            var formatFunc = scheduler.date.date_to_str(
                moment.from(date).format("jYYYY/jM/jD")
            );
            return formatFunc(date);
        };

        scheduler.templates.week_scale_date = function (date) {
            var formatFunc = scheduler.date.date_to_str(
                moment.from(date).format("jMMMM  dddd jD")
            );
            return formatFunc(date);
        };

        scheduler.templates.day_scale_date = function (date) {
            var formatFunc = scheduler.date.date_to_str(
                moment.from(date).format("jMMMM  dddd jD")
            );
            return formatFunc(date);
        };

        this.initSchedulerEvents();

        //current.getFullYear(), current.getMonth(), current.getDate()
        //const current = new Date();

        const { events } = this.props;
        let date = new Date();
        scheduler.init(
            this.schedulerContainer,
            new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()),
            "week"
        );
        scheduler.clearAll();
        scheduler.parse(events);
    }

    shouldComponentUpdate(nextProps) {
        return this.props.timeFormatState !== nextProps.timeFormatState;
    }

    componentDidUpdate() {
        scheduler.render();
    }

    setHoursScaleFormat(state) {
        scheduler.config.hour_date = state ? "%H:%i" : "%g:%i %A";
        scheduler.templates.hour_scale = scheduler.date.date_to_str(
            scheduler.config.hour_date
        );
    }

    onAddTeacherFreeTime = (values) => {
        //console.log(this.state);
        let Data = this.state.sendData;
        console.log(Data);
        const { dispatch } = this.props;

        // dispatch(addTeacherFreeTime(Data));
    };

    findIndexIfObjWithAttr = (array, attr, value) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    };

    render() {
        const { timeFormatState } = this.props;
        this.setHoursScaleFormat(timeFormatState);
        return (
            <>
                <style jsx>{``}</style>
                <div
                    ref={(input) => {
                        this.schedulerContainer = input;
                    }}
                    style={{ width: "100%", height: "100%" }}
                ></div>{" "}
            </>
        );
    }
}

export default Scheduler;
// export default connect()(Scheduler);
// export function postData(context) {
//   console.log(context);
//   const token = context.req.cookies["tutor_token"];

//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//       "My-Custom-Header": "foobar",
//     },
//     body: JSON.stringify({
//       day: "1",
//       hour_range: ["28", "29", "33"],
//     }),
//   };
//   fetch("https://api.barmansms.ir/api/teacher/time", requestOptions)
//     .then((response) => response.json())
//     .then((data) => (element.innerHTML = data.id));
// }
