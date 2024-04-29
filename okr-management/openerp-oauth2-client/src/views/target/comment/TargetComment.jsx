import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Card, CardActions, CardContent, CardHeader, TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "api";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { useMemo } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { errorNoti, successNoti } from "utils/notification";
import * as z from "zod";
import TargetCommentItem from "./TargetCommentItem";

dayjs.extend(advancedFormat);
const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 400,
    padding: 10,
    width: "100%",
    // height: "100vh",
    overflowY: "scroll",
  },
  action: {
    display: "flex",
    justifyContent: "end",
    alignItems: "end",
  },
}));

const DEBOUNCE_TIMEOUT = 500;
const PAGE_SIZE = 5;

const TargetComment = ({owner}) => {
  const classes = useStyles();
  const router = useParams();
  const history = useHistory();
  const id = router.id;
  const queryClient = useQueryClient();

  const schema = z.object({
    message: z.string().optional().nullable(),
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["target-comment", id],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await request("GET", `/targets/${id}/comments`, null, null, null, {
        params: {
          page: pageParam,
          size: PAGE_SIZE,
        },
      });

      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === PAGE_SIZE) {
        return allPages.length + 1;
      }
    },
    enabled: !!id,
  });

  const comments = useMemo(() => {
    if (data?.pages) {
      return data?.pages.flatMap((page) => page);
    }

    return [];
  }, [data?.pages]);

  const save = async (values) => {
    let successHandler = (res) => {
      queryClient.invalidateQueries(["target-comment"]);
      successNoti("Add comment successfully!", 3000);
    };

    let errorHandlers = {
      onError: (error) => errorNoti(error?.response?.data, 3000),
    };

    request("post", `/targets/${id}/comments`, successHandler, errorHandlers, values);
    methods.setValue("message", "");
  };

  const updateTargetResult = (resultId, values) => {
    let successHandler = (res) => {
      reset();
      queryClient.invalidateQueries(["target-comment"]);
      successNoti("Update target result successfully!", 3000);
    };

    let errorHandlers = {
      onError: (error) => errorNoti(error?.response?.data, 3000),
    };

    request("patch", `/targets/${resultId}/result`, successHandler, errorHandlers, values);
  };
  // show manager to detail screen
  return (
    <>
      <div className="mt-10">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(save)}>
            <Card className={classes.card}>
              <CardHeader
                title={
                  <Grid container direction="row" justifyContent="space-between" alignItems="center">
                    <div className="font-bold text-xl text-gray-500">{"Target Comment"}</div>
                  </Grid>
                }
              />
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <CardContent>
                    <Box display="flex" flexDirection="column" justifyContent="center" aria-label="Room">
                      <Controller
                        control={control}
                        name={"message"}
                        render={({ field }) => (
                          <>
                            <TextField
                              {...field}
                              id="name"
                              value={field.value}
                              error={errors?.message ? true : false}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                              label="Your comment"
                              InputLabelProps={{ shrink: true }}
                            />
                          </>
                        )}
                      />
                      <div>{errors?.message?.message}</div>
                    </Box>
                  </CardContent>
                </Grid>
                <Grid item xs={4}>
                  <CardContent>
                    <Box display="flex" flexDirection="column" justifyContent="center">
                      <Button type="submit" variant="contained" color="primary">
                        {"Comment"}
                      </Button>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
              <div>
                <Card className={classes.card}>
                  <div className="max-h-[400px] overflow-y-auto" id="scrollableDiv">
                    <InfiniteScroll
                      dataLength={comments?.length}
                      next={fetchNextPage}
                      hasMore={hasNextPage}
                      style={{ overflow: "inherit" }}
                      loader={
                        comments?.length === 0 ? (
                          <p className="text-center py-[20px]">
                            <b>{""}</b>
                          </p>
                        ) : (
                          <h4>{"loading"}</h4>
                        )
                      }
                      scrollableTarget="scrollableDiv"
                      endMessage={
                        <p className="text-center py-[20px]">
                          <b>{""}</b>
                        </p>
                      }
                    >
                      {comments?.map((comment) => (
                        <TargetCommentItem key={comment?.id} comment={comment} owner={owner} />
                      ))}
                    </InfiniteScroll>
                  </div>
                </Card>
              </div>
              <CardActions className={classes.action}></CardActions>
            </Card>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default TargetComment;
