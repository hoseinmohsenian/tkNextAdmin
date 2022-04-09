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
                var now = moment(new Date(2022, 2, 7)); //todays date
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

                // this.dataFromServer.map(function(data){this.setState({dataFromServer: day:""})})

                // ******************* I CHANGED HERE ********************************
                let oldHourRange = this.state.dataFromServer[x].hour_range;
                console.log(oldHourRange);
                oldHourRange = [...oldHourRange, ...this.state.hour_range];

                console.log("old rng", oldHourRange);

                let oldDataServer = this.state.dataFromServer;
                oldDataServer[x].hour_range = oldHourRange;

                this.setState({ dataFromServer: oldDataServer });
                this.setState({ sendData: oldDataServer[x] });
                this.onAddTeacherFreeTime();

                this.setState({ day: "", hour_range: [], sendData: {} });
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
            "date",
            "next",
            "today",
            "prev",
        ];

        scheduler.config.icons_select = ["icon_delete"];

        scheduler.config.hour_date = "%g:%i %A";
        scheduler.xy.scale_width = 70;
        scheduler.config.event_duration = 30;
        scheduler.config.timeline_swap_resize = false;
        scheduler.config.time_step = 30;
        // scheduler.config.displayed_event_color = "orange";
        scheduler.config.displayed_event_text_color = "green";

        scheduler.config.dblclick_create = false;
        scheduler.config.drag_resize = false;
        scheduler.config.drag_move = false;
        scheduler.config.drag_create = false;

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

        const { events } = this.props;
        scheduler.init(this.schedulerContainer, new Date(), "week");
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
        console.log("data ", Data);
        console.log("values", values);
        const { dispatch } = this.props;
        console.log("addTeacherFreeTime");
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
