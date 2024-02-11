import { expectError, expectType } from "tsd";
import { FlowRouter } from ".";

FlowRouter.route("/", {
    name: "home",
});

FlowRouter.go("/");

expectType<string>(FlowRouter.current().route.name);

FlowRouter.route("/post/:id", {
    name: "singlePost",
});
FlowRouter.go("singlePost", { id: "12345" });

// Should return a string even though the paramater is a number
expectType<string>(FlowRouter.getParam("id"));

// Should return an error when a number is given instead of a string
expectError(FlowRouter.go("singlePost", { id: 12345 }));
