import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider 
} from '@mui/material';

function ConstitutionResult({ result, solutions }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        체질 분석 결과
      </Typography>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            당신의 체질
          </Typography>
          <Typography variant="h4" color="primary" gutterBottom>
            {result.overallType}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                체형: {result.bodyType}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                기질: {result.temperamentType}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>
        맞춤형 건강 솔루션
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                식이 요법
              </Typography>
              <List>
                {solutions.diet.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText primary={item} />
                    </ListItem>
                    {index < solutions.diet.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                운동 처방
              </Typography>
              <List>
                {solutions.exercise.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText primary={item} />
                    </ListItem>
                    {index < solutions.exercise.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                생활 습관
              </Typography>
              <List>
                {solutions.lifestyle.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText primary={item} />
                    </ListItem>
                    {index < solutions.lifestyle.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                추천 보약
              </Typography>
              <List>
                {solutions.medicine.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText primary={item} />
                    </ListItem>
                    {index < solutions.medicine.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ConstitutionResult; 